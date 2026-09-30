import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { hashPassword, createToken } from "@/lib/auth";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, avatar } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email akun Google tidak ditemukan." },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    let user = await withRetry(() =>
      prisma.user.findUnique({
        where: { email: cleanEmail },
      })
    );

    if (user) {
      // Update avatar if not set yet and provided by Google
      if (!user.avatar && avatar) {
        user = await withRetry(() =>
          prisma.user.update({
            where: { id: user!.id },
            data: { avatar },
          })
        );
      }
    } else {
      // Create new user for first-time Google sign in / registration
      const randomPassword = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await hashPassword(randomPassword);

      user = await withRetry(() =>
        prisma.user.create({
          data: {
            name: name || cleanEmail.split("@")[0],
            email: cleanEmail,
            password: hashedPassword,
            avatar: avatar || null,
            university: "Universitas Indonesia",
            major: "Teknik Informatika",
            nim: "",
            semester: 1,
          },
        })
      );
    }

    // Generate session JWT token
    const token = await createToken({
      userId: user.id,
      email: user.email,
    });

    const response = NextResponse.json(
      {
        message: "Login Google berhasil",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          university: user.university,
          major: user.major,
          nim: user.nim,
          semester: user.semester,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Google Auth Error:", error);
    const msg = error?.message || "";
    const isConnErr =
      msg.includes("connection") ||
      msg.includes("remote host") ||
      msg.includes("I/O error") ||
      msg.includes("InternalError");

    return NextResponse.json(
      {
        error: isConnErr
          ? "Koneksi ke database sedang terhubung ulang, silakan coba login Google lagi."
          : "Gagal memproses autentikasi Google. Silakan coba kembali.",
      },
      { status: 500 }
    );
  }
}
