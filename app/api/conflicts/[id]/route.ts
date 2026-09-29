import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const conflict = await prisma.conflict.findUnique({
      where: { id },
      include: {
        scheduleA: true,
        scheduleB: true,
      },
    });

    if (!conflict) {
      return NextResponse.json({ error: "Konflik tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ conflict });
  } catch (error: any) {
    console.error("Get Conflict Detail Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data konflik" }, { status: 500 });
  }
}

export async function PATCH(
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
    const { status, resolutionNotes } = body;

    const existing = await prisma.conflict.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== session.userId) {
      return NextResponse.json({ error: "Konflik tidak ditemukan atau tidak berhak" }, { status: 404 });
    }

    const updated = await prisma.conflict.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(resolutionNotes !== undefined && { resolutionNotes }),
        ...(status === "resolved" && { resolvedAt: new Date() }),
      },
    });

    return NextResponse.json({ message: "Status konflik berhasil diperbarui", conflict: updated });
  } catch (error: any) {
    console.error("Update Conflict Status Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui status konflik" }, { status: 500 });
  }
}
