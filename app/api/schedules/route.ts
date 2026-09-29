import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import { timeToMinutes, validateScheduleTime } from "@/lib/collisionEngine";

// Helper: Check overlap between two time spans on the same day
function checkOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
) {
  const sA = timeToMinutes(startA);
  const eA = timeToMinutes(endA);
  const sB = timeToMinutes(startB);
  const eB = timeToMinutes(endB);

  const isCollision = sA < eB && eA > sB;
  if (!isCollision) return null;

  const overlapStartMin = Math.max(sA, sB);
  const overlapEndMin = Math.min(eA, eB);
  const overlapMinutes = overlapEndMin - overlapStartMin;

  const formatMin = (m: number) => {
    const hh = String(Math.floor(m / 60)).padStart(2, "0");
    const mm = String(m % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  return {
    overlapStart: formatMin(overlapStartMin),
    overlapEnd: formatMin(overlapEndMin),
    overlapMinutes,
  };
}

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day");
    const category = searchParams.get("category");

    const whereClause: any = {};
    if (session) {
      whereClause.userId = session.userId;
    }
    if (day) {
      whereClause.day = day.toLowerCase();
    }
    if (category) {
      whereClause.category = category.toLowerCase();
    }

    const schedules = await withRetry(() =>
      prisma.schedule.findMany({
        where: whereClause,
        orderBy: { startTime: "asc" },
      })
    );

    return NextResponse.json({ schedules });
  } catch (error: any) {
    console.error("Get Schedules Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data jadwal" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      category,
      day,
      startTime,
      endTime,
      location,
      notes,
      isRoutine = true,
      priority = "wajib",
      courseCode,
      lecturer,
      sks,
      role,
      specificDate,
    } = body;

    if (!name || !category || !day || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Nama kegiatan, kategori, hari, dan jam mulai/selesai wajib diisi" },
        { status: 400 }
      );
    }

    if (!validateScheduleTime(startTime, endTime)) {
      return NextResponse.json(
        { error: "Jam selesai harus lebih akhir daripada jam mulai" },
        { status: 400 }
      );
    }

    // 1. Create the new schedule
    const newSchedule = await prisma.schedule.create({
      data: {
        userId: session.userId,
        name,
        category: category.toLowerCase(),
        day: day.toLowerCase(),
        startTime,
        endTime,
        location: location || "",
        notes: notes || "",
        isRoutine: Boolean(isRoutine),
        priority: priority || "wajib",
        courseCode: courseCode || null,
        lecturer: lecturer || null,
        sks: sks ? Number(sks) : null,
        role: role || null,
        specificDate: specificDate ? new Date(specificDate) : null,
      },
    });

    // 2. Automated Collision Detection on same day
    const existingSchedules = await prisma.schedule.findMany({
      where: {
        userId: session.userId,
        day: day.toLowerCase(),
        id: { not: newSchedule.id },
      },
    });

    const detectedConflicts = [];

    for (const other of existingSchedules) {
      const overlap = checkOverlap(
        newSchedule.startTime,
        newSchedule.endTime,
        other.startTime,
        other.endTime
      );

      if (overlap) {
        // Create conflict record
        const conflict = await prisma.conflict.create({
          data: {
            userId: session.userId,
            scheduleAId: other.id,
            scheduleBId: newSchedule.id,
            day: day.toLowerCase(),
            overlapStart: overlap.overlapStart,
            overlapEnd: overlap.overlapEnd,
            overlapMinutes: overlap.overlapMinutes,
            status: "unresolved",
          },
        });

        // Create notification alert
        await prisma.notification.create({
          data: {
            userId: session.userId,
            title: `Bentrok: ${newSchedule.name} & ${other.name}`,
            message: `Terjadi bentrokan ${overlap.overlapMinutes} menit pada hari ${day} (${overlap.overlapStart} - ${overlap.overlapEnd}).`,
            type: "collision",
            link: `/conflict/${conflict.id}`,
          },
        });

        detectedConflicts.push({
          conflictId: conflict.id,
          collidingWith: other.name,
          overlapMinutes: overlap.overlapMinutes,
          overlapStart: overlap.overlapStart,
          overlapEnd: overlap.overlapEnd,
        });
      }
    }

    return NextResponse.json(
      {
        message: "Jadwal berhasil ditambahkan",
        schedule: newSchedule,
        hasCollision: detectedConflicts.length > 0,
        collisions: detectedConflicts,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Schedule Error:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan jadwal" },
      { status: 500 }
    );
  }
}
