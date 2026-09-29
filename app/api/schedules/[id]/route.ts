import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const schedule = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      return NextResponse.json({ error: "Jadwal tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ schedule });
  } catch (error: any) {
    console.error("Get Schedule by ID Error:", error);
    return NextResponse.json({ error: "Gagal mengambil jadwal" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: "Jadwal tidak ditemukan atau tidak berhak" }, { status: 404 });
    }

    const updated = await prisma.schedule.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.category && { category: body.category.toLowerCase() }),
        ...(body.day && { day: body.day.toLowerCase() }),
        ...(body.startTime && { startTime: body.startTime }),
        ...(body.endTime && { endTime: body.endTime }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.isRoutine !== undefined && { isRoutine: Boolean(body.isRoutine) }),
        ...(body.priority && { priority: body.priority }),
        ...(body.courseCode !== undefined && { courseCode: body.courseCode }),
        ...(body.lecturer !== undefined && { lecturer: body.lecturer }),
        ...(body.sks !== undefined && { sks: body.sks ? Number(body.sks) : null }),
        ...(body.role !== undefined && { role: body.role }),
      },
    });

    return NextResponse.json({ message: "Jadwal berhasil diperbarui", schedule: updated });
  } catch (error: any) {
    console.error("Update Schedule Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui jadwal" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.schedule.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: "Jadwal tidak ditemukan atau tidak berhak" }, { status: 404 });
    }

    // Delete associated conflicts first (or cascade)
    await prisma.conflict.deleteMany({
      where: {
        OR: [{ scheduleAId: id }, { scheduleBId: id }],
      },
    });

    await prisma.schedule.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Jadwal berhasil dihapus" });
  } catch (error: any) {
    console.error("Delete Schedule Error:", error);
    return NextResponse.json({ error: "Gagal menghapus jadwal" }, { status: 500 });
  }
}
