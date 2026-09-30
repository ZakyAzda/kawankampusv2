import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const TAG = "[dummy]";

type Cat = "kuliah" | "organisasi" | "lainnya";
type Item = {
  name: string;
  category: Cat;
  day: string;
  startTime: string;
  endTime: string;
  location?: string;
  priority?: "wajib" | "fleksibel";
  isRoutine?: boolean;
  courseCode?: string;
  lecturer?: string;
  sks?: number;
  role?: string;
  note: string;
};

// Urutan penting: jadwal yang lebih dulu di daftar menjadi "Schedule A" pada konflik.
const items: Item[] = [
  // ---- SENIN ----
  { name: "Kalkulus Multivariabel", category: "kuliah", day: "senin", startTime: "08:00", endTime: "10:30",
    location: "R. 201", courseCode: "MA101", lecturer: "Dr. Sari", sks: 3, note: "Skenario 1: tanpa bentrok (pasangan Fisika)" },
  { name: "Praktikum Fisika Dasar", category: "kuliah", day: "senin", startTime: "13:00", endTime: "15:00",
    location: "Lab Fisika", courseCode: "FI102", lecturer: "Pak Budi", sks: 2, note: "Skenario 1: tanpa bentrok (pasangan Kalkulus)" },
  { name: "Rapat UKM Fotografi", category: "organisasi", day: "senin", startTime: "16:00", endTime: "17:30",
    location: "Sekretariat UKM", role: "Anggota", priority: "fleksibel", isRoutine: false, note: "Jadwal tunggal, tanpa bentrok" },

  // ---- SELASA ----
  { name: "Struktur Data", category: "kuliah", day: "selasa", startTime: "09:00", endTime: "11:30",
    location: "Lab Komputer 1", courseCode: "TI201", lecturer: "Bu Rina", sks: 3, note: "Skenario 2: batas tepat 11:30 (tanpa bentrok)" },
  { name: "Olahraga Futsal Prodi", category: "organisasi", day: "selasa", startTime: "11:30", endTime: "14:00",
    location: "Lapangan Futsal", role: "Pemain", priority: "fleksibel", note: "Skenario 2: mulai tepat saat Struktur Data selesai" },
  { name: "Rapat Himpunan", category: "organisasi", day: "selasa", startTime: "15:00", endTime: "16:30",
    location: "Sekretariat Himpunan", role: "Anggota Divisi Acara", priority: "fleksibel", isRoutine: false, note: "Bentrok kecil 15 menit dengan Konsultasi PA" },
  { name: "Konsultasi Dosen PA", category: "lainnya", day: "selasa", startTime: "16:15", endTime: "17:00",
    location: "Ruang Dosen", priority: "wajib", isRoutine: false, note: "Bentrok kecil 15 menit dengan Rapat Himpunan" },

  // ---- RABU ----
  { name: "Seminar Kewirausahaan", category: "kuliah", day: "rabu", startTime: "09:00", endTime: "11:00",
    location: "Aula Utama", courseCode: "UM201", lecturer: "Pak Hadi", sks: 2, note: "Skenario 4: bentrok 60 menit (10:00-11:00)" },
  { name: "Briefing Divisi Humas", category: "organisasi", day: "rabu", startTime: "10:00", endTime: "11:30",
    location: "Ruang BEM", role: "Staf Humas", priority: "fleksibel", isRoutine: false, note: "Skenario 4: bentrok 60 menit dengan Seminar" },
  { name: "Basis Data", category: "kuliah", day: "rabu", startTime: "13:00", endTime: "15:00",
    location: "R. 305", courseCode: "TI205", lecturer: "Pak Andi", sks: 3, note: "Jadwal tunggal, tanpa bentrok" },

  // ---- KAMIS ----
  { name: "Jaringan Komputer", category: "kuliah", day: "kamis", startTime: "08:00", endTime: "09:40",
    location: "Lab Jaringan", courseCode: "TI301", lecturer: "Bu Dewi", sks: 2, note: "Berurutan langsung dengan Sistem Operasi (tanpa bentrok)" },
  { name: "Sistem Operasi", category: "kuliah", day: "kamis", startTime: "09:40", endTime: "11:20",
    location: "R. 302", courseCode: "TI302", lecturer: "Pak Rian", sks: 2, note: "Berurutan langsung dengan Jaringan Komputer" },
  { name: "Kecerdasan Buatan", category: "kuliah", day: "kamis", startTime: "13:00", endTime: "15:00",
    location: "R. 402", courseCode: "TI305", lecturer: "Dr. Hendra", sks: 3, note: "Skenario 3: bentrok 60 menit (14:00-15:00)" },
  { name: "Rapat Dies Natalis", category: "organisasi", day: "kamis", startTime: "14:00", endTime: "16:00",
    location: "Selasar Rektorat", role: "Panitia Acara", priority: "fleksibel", isRoutine: false, note: "Skenario 3: bentrok 60 menit dengan Kecerdasan Buatan" },

  // ---- JUMAT ----
  { name: "Pemrograman Web Lanjut", category: "kuliah", day: "jumat", startTime: "08:00", endTime: "10:00",
    location: "Lab Komputer 3", courseCode: "TI310", lecturer: "Dr. Hendra", sks: 3, note: "Containment: Rapat BEM di dalam jam kuliah (status resolved)" },
  { name: "Rapat Kecil BEM", category: "organisasi", day: "jumat", startTime: "08:30", endTime: "09:30",
    location: "Ruang BEM", role: "Ketua Divisi", priority: "fleksibel", isRoutine: false, note: "Containment: seluruhnya berada dalam jam kuliah" },
  { name: "Diskusi Buku Komunitas", category: "lainnya", day: "jumat", startTime: "19:00", endTime: "21:00",
    location: "Kafe Baca", priority: "fleksibel", isRoutine: false, note: "Skenario 5: jadwal tunggal, tanpa bentrok" },

  // ---- SABTU ----
  { name: "Latihan Basket UKM", category: "organisasi", day: "sabtu", startTime: "08:00", endTime: "10:00",
    location: "GOR Kampus", role: "Anggota", priority: "fleksibel", note: "Bentrok 30 menit dengan Workshop (status ignored)" },
  { name: "Workshop UI/UX", category: "lainnya", day: "sabtu", startTime: "09:30", endTime: "11:30",
    location: "Ruang Kreatif", priority: "fleksibel", isRoutine: false, note: "Bentrok 30 menit dengan Latihan Basket" },
  { name: "Kerja Kelompok Proyek", category: "kuliah", day: "sabtu", startTime: "13:00", endTime: "15:00",
    location: "Perpustakaan", priority: "wajib", isRoutine: false, note: "Jadwal tunggal, tanpa bentrok" },

  // ---- MINGGU ----
  { name: "Bakti Sosial Kampus", category: "organisasi", day: "minggu", startTime: "08:00", endTime: "12:00",
    location: "Panti Asuhan", role: "Relawan", priority: "fleksibel", isRoutine: false, note: "Jadwal tunggal, tanpa bentrok" },
];

// Seluruh irisan waktu dianggap sebagai konflik aktif (unresolved) secara konsisten
const STATUS_OVERRIDE: Record<string, { status: string; notes?: string }> = {};

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const fmt = (n: number) => `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

const INFO_TITLES = ["Pengingat kuliah besok", "Selamat datang di KawanKampus"];

export async function seedForEmail(rawEmail: string) {
  const email = rawEmail.toLowerCase().trim();
  console.log(`🌱 Memulai seeding jadwal untuk ${email}...`);

  // Cari atau buat user secara otomatis jika belum ada
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: email.split("@")[0],
      password: hashedPassword,
      university: "Universitas Indonesia",
      major: "Teknik Informatika",
      nim: "2106728192",
      semester: 5,
    },
  });

  console.log(`✅ User aktif: ${user.name} (${user.email})`);

  // Hapus dummy lama (hanya yang bertanda [dummy]) atau semua jadwal user ini jika diinginkan
  const old = await prisma.schedule.findMany({
    where: { userId: user.id },
    select: { id: true },
  });
  const oldIds = old.map((s) => s.id);
  if (oldIds.length) {
    const oldConf = await prisma.conflict.findMany({
      where: { OR: [{ scheduleAId: { in: oldIds } }, { scheduleBId: { in: oldIds } }] },
      select: { id: true },
    });
    const confIds = oldConf.map((c) => c.id);
    await prisma.notification.deleteMany({
      where: { userId: user.id },
    });
    await prisma.conflict.deleteMany({ where: { userId: user.id } });
    await prisma.schedule.deleteMany({ where: { userId: user.id } });
  }

  // Buat jadwal baru
  const created: (Item & { id: string })[] = [];
  for (const it of items) {
    const { note, ...rest } = it;
    const s = await prisma.schedule.create({
      data: {
        userId: user.id,
        ...rest,
        priority: it.priority ?? "wajib",
        isRoutine: it.isRoutine ?? true,
        notes: `${TAG} ${note}`,
      },
    });
    created.push({ ...it, id: s.id });
  }

  // Deteksi konflik per hari (irisan waktu > 0 menit)
  let conflictCount = 0;
  for (let i = 0; i < created.length; i++) {
    for (let j = i + 1; j < created.length; j++) {
      const a = created[i], b = created[j];
      if (a.day !== b.day) continue;
      const s = Math.max(toMin(a.startTime), toMin(b.startTime));
      const e = Math.min(toMin(a.endTime), toMin(b.endTime));
      if (e <= s) continue;

      const ov = STATUS_OVERRIDE[`${a.name}|${b.name}`];
      const status = ov?.status ?? "unresolved";
      const c = await prisma.conflict.create({
        data: {
          userId: user.id,
          scheduleAId: a.id,
          scheduleBId: b.id,
          day: a.day,
          overlapStart: fmt(s),
          overlapEnd: fmt(e),
          overlapMinutes: e - s,
          status,
          resolutionNotes: ov?.notes,
          resolvedAt: status === "resolved" ? new Date() : undefined,
        },
      });
      conflictCount++;
      console.log(`  ⚡ bentrok ${a.day}: ${a.name} vs ${b.name} (${e - s} menit, ${status})`);

      if (status === "unresolved") {
        await prisma.notification.create({
          data: {
            userId: user.id,
            title: `Bentrok ${e - s} menit terdeteksi`,
            message: `${a.name} bertabrakan dengan ${b.name} pada hari ${a.day} (${fmt(s)}-${fmt(e)}).`,
            type: "collision",
            link: `/conflict/${c.id}`,
          },
        });
      }
    }
  }

  await prisma.notification.create({
    data: {
      userId: user.id,
      title: INFO_TITLES[0],
      type: "reminder",
      message: "Kalkulus Multivariabel dimulai pukul 08:00 di R. 201.",
    },
  });
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: INFO_TITLES[1],
      type: "system",
      isRead: true,
      message: "Auto-Collision Radar siap memantau jadwalmu.",
    },
  });

  console.log(`🎉 Selesai untuk ${email}: ${created.length} jadwal, ${conflictCount} konflik.`);
}

async function main() {
  const email = process.argv[2] || "dimas@ui.ac.id";
  await seedForEmail(email);
}

if (require.main === module || process.argv[1]?.includes("seed-user")) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
