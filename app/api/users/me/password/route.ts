import { NextRequest, NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { getSessionUser, hashPassword } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    const body = await req.json();
    const { newPassword, confirmPassword } = body;

    // Validasi input
    if (!newPassword || typeof newPassword !== "string") {
      return NextResponse.json({ error: "Password baru wajib diisi" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password minimal 8 karakter" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json({ error: "Konfirmasi password tidak cocok" }, { status: 400 });
    }

    // Hash dan simpan password baru
    const hashedPassword = await hashPassword(newPassword);

    await withRetry(() =>
      prisma.user.update({
        where: { id: session.userId },
        data: { password: hashedPassword },
      })
    );

    return NextResponse.json({ message: "Password berhasil diperbarui" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
