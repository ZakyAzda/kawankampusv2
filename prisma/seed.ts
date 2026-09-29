import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai seeding database...");

  // 1. Buat User Contoh (Dimas Wicaksono)
  const hashedPassword = await bcrypt.hash("password123", 10);
  const user = await prisma.user.upsert({
    where: { email: "dimas@ui.ac.id" },
    update: {},
    create: {
      name: "Dimas Wicaksono",
      email: "dimas@ui.ac.id",
      password: hashedPassword,
      university: "Universitas Indonesia",
      major: "S1 Ilmu Komputer",
      nim: "2106728192",
      semester: 5,
    },
  });

  console.log(`✅ User dibuat/ditemukan: ${user.name} (${user.email})`);

  // 2. Bersihkan jadwal lama user ini jika ada
  await prisma.conflict.deleteMany({ where: { userId: user.id } });
  await prisma.schedule.deleteMany({ where: { userId: user.id } });

  // 3. Tambah Jadwal Kuliah & Organisasi Contoh
  const s1 = await prisma.schedule.create({
    data: {
      userId: user.id,
      name: "Pemrograman Web Lanjut",
      category: "kuliah",
      day: "kamis",
      startTime: "08:00",
      endTime: "10:30",
      location: "Lab Komputer 3 • Gd. Informatika",
      lecturer: "Dr. Hendra, S.T.",
      priority: "wajib",
      isRoutine: true,
      sks: 3,
      courseCode: "CS302",
    },
  });

  const s2 = await prisma.schedule.create({
    data: {
      userId: user.id,
      name: "Kecerdasan Buatan",
      category: "kuliah",
      day: "kamis",
      startTime: "13:00",
      endTime: "15:00",
      location: "Ruang Kuliah 402",
      lecturer: "Dr. Ir. Hendra, M.T.",
      priority: "wajib",
      isRoutine: true,
      sks: 3,
      courseCode: "CS305",
      notes: "Presensi minimal 75%",
    },
  });

  const s3 = await prisma.schedule.create({
    data: {
      userId: user.id,
      name: "Rapat Divisi Acara BEM",
      category: "organisasi",
      day: "kamis",
      startTime: "14:00",
      endTime: "16:00",
      location: "Selasar Rektorat",
      role: "Ketua Divisi Acara",
      priority: "fleksibel",
      isRoutine: false,
      notes: "Membahas rundown acara Dies Natalis",
    },
  });

  console.log("✅ 3 Jadwal berhasil ditambahkan");

  // 4. Buat Konflik antara Jadwal s2 dan s3 (Bentrok 14:00 - 15:00)
  const conflict = await prisma.conflict.create({
    data: {
      userId: user.id,
      scheduleAId: s2.id,
      scheduleBId: s3.id,
      day: "kamis",
      overlapStart: "14:00",
      overlapEnd: "15:00",
      overlapMinutes: 60,
      status: "unresolved",
    },
  });

  console.log(`⚠️ Konflik terdeteksi & dicatat: ${conflict.id} (60 Menit)`);

  // 5. Buat Notifikasi Radar
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: "2 Konflik Jadwal Terdeteksi!",
      message: "Potensi tumpang tindih waktu teridentifikasi hari ini antara Kecerdasan Buatan dan Rapat BEM.",
      type: "collision",
      link: `/conflict/${conflict.id}`,
    },
  });

  console.log("🔔 Notifikasi awal dibuat");
  console.log("🎉 Seeding selesai dengan sukses!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
