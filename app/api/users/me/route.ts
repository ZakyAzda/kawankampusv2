import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          university: true,
          major: true,
          semester: true,
          createdAt: true,
        },
      })
    );

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // Get counts separately
    const [schedulesByCategory, totalSchedules, totalConflicts, conflictsUnresolved] =
      await Promise.all([
        withRetry(() =>
          prisma.schedule.groupBy({
            by: ["category"],
            where: { userId: session.userId },
            _count: true,
          })
        ),
        withRetry(() => prisma.schedule.count({ where: { userId: session.userId } })),
        withRetry(() => prisma.conflict.count({ where: { userId: session.userId } })),
        withRetry(() =>
          prisma.conflict.count({
            where: { userId: session.userId, status: "unresolved" },
          })
        ),
      ]);

    const categoryMap: Record<string, number> = {};
    for (const s of schedulesByCategory) {
      categoryMap[s.category] = s._count;
    }

    return NextResponse.json({
      user: {
        ...user,
        scheduleCount: totalSchedules,
        conflictCount: totalConflicts,
        unresolvedConflicts: conflictsUnresolved,
        schedulesByCategory: categoryMap,
      },
    });
  } catch (error: any) {
    console.error("Get User Profile Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data profil" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const body = await req.json();

    const updated = await withRetry(() =>
      prisma.user.update({
        where: { id: session.userId },
        data: {
          ...(body.name && { name: body.name }),
          ...(body.university !== undefined && { university: body.university }),
          ...(body.major !== undefined && { major: body.major }),
          ...(body.semester !== undefined && {
            semester: body.semester ? Number(body.semester) : null,
          }),
        },
        select: {
          id: true,
          name: true,
          email: true,
          nim: true,
          university: true,
          major: true,
          semester: true,
        },
      })
    );

    return NextResponse.json({ user: updated, message: "Profil berhasil diperbarui" });
  } catch (error: any) {
    console.error("Update User Profile Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
