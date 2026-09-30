import { NextResponse } from "next/server";
import { prisma, withRetry } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

/* ─────────────────────────────────────────────
   GET  /api/users/me  → data profil + statistik
   PATCH /api/users/me → update profil (name, nim, university, major, semester)
───────────────────────────────────────────── */

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

/* ─── helper validasi teks wajib ─── */
function readRequiredText(
  value: unknown,
  label: string,
  min: number,
  max: number
): { value: string } | { error: string } {
  const text = typeof value === "string" ? value.trim() : "";
  if (text.length < min) {
    return { error: min <= 1 ? `${label} wajib diisi` : `${label} minimal ${min} karakter` };
  }
  if (text.length > max) {
    return { error: `${label} maksimal ${max} karakter` };
  }
  return { value: text };
}

export async function PATCH(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Belum terautentikasi" }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Format data tidak valid" }, { status: 400 });
    }

    // Hanya field ini yang boleh diubah lewat endpoint ini.
    // (email & password sengaja tidak bisa diubah di sini)
    const data: {
      name?: string;
      nim?: string | null;
      university?: string;
      major?: string;
      semester?: number;
    } = {};

    if (body.name !== undefined) {
      const r = readRequiredText(body.name, "Nama", 2, 80);
      if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
      data.name = r.value;
    }

    if (body.university !== undefined) {
      const r = readRequiredText(body.university, "Universitas", 1, 100);
      if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
      data.university = r.value;
    }

    if (body.major !== undefined) {
      const r = readRequiredText(body.major, "Jurusan", 1, 100);
      if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400 });
      data.major = r.value;
    }

    if (body.nim !== undefined) {
      const nim = body.nim === null ? "" : String(body.nim).trim();
      if (nim === "") {
        data.nim = null; // NIM boleh dikosongkan
      } else if (!/^\d{5,20}$/.test(nim)) {
        return NextResponse.json(
          { error: "NIM hanya boleh angka (5–20 digit)" },
          { status: 400 }
        );
      } else {
        data.nim = nim;
      }
    }

    if (body.semester !== undefined) {
      const semester = Number(body.semester);
      if (!Number.isInteger(semester) || semester < 1 || semester > 14) {
        return NextResponse.json(
          { error: "Semester harus berupa angka 1–14" },
          { status: 400 }
        );
      }
      data.semester = semester;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Tidak ada data yang diubah" }, { status: 400 });
    }

    const updated = await withRetry(() =>
      prisma.user.update({
        where: { id: session.userId },
        data,
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