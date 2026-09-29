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
        university: true,
        major: true,
        nim: true,
        semester: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: {
            schedules: true,
            conflicts: true,
            notifications: true,
          },
        },
      },
    }));

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Get Profile Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data profil" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const body = await req.json();
    const { name, university, major, nim, semester, avatar } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.userId },
      data: {
        ...(name && { name }),
        ...(university && { university }),
        ...(major && { major }),
        ...(nim && { nim }),
        ...(semester && { semester: Number(semester) }),
        ...(avatar !== undefined && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        university: true,
        major: true,
        nim: true,
        semester: true,
        avatar: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error("Update Profile Error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}
