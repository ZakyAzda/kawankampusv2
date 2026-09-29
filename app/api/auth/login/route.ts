import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emailOrNim, password } = body;

    if (!emailOrNim || !password) {
      return NextResponse.json(
        { error: "Email/NIM dan password wajib diisi" },
        { status: 400 }
      );
    }

    const identifier = emailOrNim.toLowerCase().trim();

    // Find by email or nim with retry on connection drop
    const user = await withRetry(() =>
      prisma.user.findFirst({
        where: {
          OR: [{ email: identifier }, { nim: identifier }],
        },
      })
    );

    if (!user) {
      return NextResponse.json(
        { error: "Email/NIM atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Email/NIM atau kata sandi tidak cocok." },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          university: user.university,
          major: user.major,
          nim: user.nim,
          semester: user.semester,
        },
      },
      { status: 200 }
    );

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    const msg = error?.message || "";
    const isConnErr = msg.includes("connection") || msg.includes("remote host") || msg.includes("I/O error");
    return NextResponse.json(
      {
        error: isConnErr
          ? "Koneksi ke database sedang terhubung ulang, silakan klik 'Masuk Sekarang' lagi."
          : "Gagal memproses login. Coba lagi dalam beberapa saat.",
      },
      { status: 500 }
    );
  }
}
