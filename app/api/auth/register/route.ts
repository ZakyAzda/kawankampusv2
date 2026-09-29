import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, university, major, nim } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan password wajib diisi" },
        { status: 400 }
      );
    }

    // Check if user already exists (with auto-retry on connection drop)
    const existing = await withRetry(() =>
      prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      })
    );

    if (existing) {
      return NextResponse.json(
        { error: "Email sudah terdaftar" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await withRetry(() => prisma.user.create({
      data: {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        university: university || "Universitas Indonesia",
        major: major || "Teknik Informatika",
        nim: nim || "",
        semester: 1,
      },
    }));

    const token = await createToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: "Registrasi berhasil",
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
      { status: 201 }
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Register Error:", error);
    const msg = error?.message || "";
    const isConnErr = msg.includes("connection") || msg.includes("remote host") || msg.includes("I/O error") || msg.includes("InternalError");
    return NextResponse.json(
      {
        error: isConnErr
          ? "Koneksi ke database sedang terhubung ulang, silakan coba daftar lagi."
          : "Terjadi kesalahan server saat mendaftar. Coba lagi dalam beberapa saat.",
      },
      { status: 500 }
    );
  }
}
