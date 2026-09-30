@"
# Kawan Kampus

Kawan Kampus adalah aplikasi manajemen jadwal mahasiswa yang membantu pengguna mengatur jadwal kuliah dan kegiatan serta mendeteksi bentrok jadwal.

## Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- MongoDB
- Firebase
- Zustand
- bcryptjs
- jose

## Struktur Data

Database menggunakan MongoDB dengan Prisma.

Model utama:

- User — data pengguna
- Schedule — data jadwal/kegiatan
- Conflict — data bentrok antar jadwal
- Notification — notifikasi pengguna

Relasi utama:

User -> Schedule
User -> Conflict
User -> Notification

Schedule -> Conflict (Schedule A / Schedule B)

## Instalasi

Clone repository:

git clone https://github.com/ZakyAzda/kawankampusv2.git

Masuk ke folder:

cd kawankampusv2

Install dependency:

npm install

Buat file `.env` berdasarkan `.env.example`.

Isi minimal:

DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/kawankampus"
JWT_SECRET="your-secret-key"

## Menjalankan Aplikasi

Development:

npm run dev

Kemudian buka:

http://localhost:3000

## Testing Collision Engine

Pengujian Collision Engine dapat dijalankan dengan:

npx tsx test_collision.ts

Functional Test P0 terdiri dari lima skenario:

- B-01 — No Conflict
- B-02 — Exact Boundary
- B-03 — Partial Overlap
- B-04 — Containment
- B-05 — Invalid Time Input

Hasil pengujian saat dokumentasi dibuat:

5 PASS / 0 FAIL

## Build

Untuk melakukan production build:

npm run build

Untuk menjalankan hasil production:

npm run start

## Batasan MVP

- Sistem masih berfokus pada pengelolaan jadwal dan deteksi bentrok.
- Beberapa konfigurasi layanan eksternal membutuhkan environment variable yang valid.
- Pengujian yang tersedia saat ini masih berfokus pada Collision Engine.
- Demo dan pengujian end-to-end aplikasi perlu dilengkapi sesuai kebutuhan reviewer.

## Repository

https://github.com/ZakyAzda/kawankampusv2
"@ | Set-Content 02_README.md