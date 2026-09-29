import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const conflicts = await prisma.conflict.findMany({
      where: { userId: session.userId },
      include: {
        scheduleA: true,
        scheduleB: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const unresolvedCount = conflicts.filter((c: { status: string }) => c.status === "unresolved").length;
    const resolvedCount = conflicts.filter((c: { status: string }) => c.status === "resolved").length;

    return NextResponse.json({
      conflicts,
      stats: {
        total: conflicts.length,
        unresolved: unresolvedCount,
        resolved: resolvedCount,
        healthScore:
          conflicts.length === 0
            ? 100
            : Math.round(((conflicts.length - unresolvedCount) / conflicts.length) * 100),
      },
    });
  } catch (error: any) {
    console.error("Get Conflicts Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data konflik" }, { status: 500 });
  }
}
