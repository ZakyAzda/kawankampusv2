# Handover — Kawan Kampus

## 1. Fitur yang Berjalan

- Autentikasi pengguna
- Register dan login
- Pengelolaan jadwal
- Kalender jadwal
- Tampilan jadwal mingguan
- Deteksi bentrok jadwal
- Detail konflik
- Notifikasi
- Profile pengguna
- Collision Engine

## 2. Collision Engine

Collision Engine digunakan untuk mendeteksi bentrok antara dua jadwal berdasarkan tanggal dan waktu.

Functional Test P0 telah dilakukan dengan hasil:

| Test | Skenario | Hasil |
|---|---|---|
| B-01 | Tidak ada bentrok | PASS |
| B-02 | Exact boundary | PASS |
| B-03 | Partial overlap | PASS |
| B-04 | Containment | PASS |
| B-05 | Input waktu tidak valid | PASS |

**Total: 5 PASS / 0 FAIL**

Dokumentasi pengujian:
`03_FunctionalTest_P0.md`

## 3. Hal yang Perlu Diperhatikan

- MongoDB membutuhkan konfigurasi `DATABASE_URL`.
- JWT membutuhkan konfigurasi `JWT_SECRET`.
- Environment variable perlu disiapkan berdasarkan `.env.example`.
- Testing saat ini terutama berfokus pada Collision Engine.
- Functional/E2E testing aplikasi secara keseluruhan masih dapat dikembangkan.
- Demo aplikasi perlu dilakukan menggunakan environment yang sudah dikonfigurasi.

## 4. Parking Lot

- Menambah test case Collision Engine.
- Membuat automated testing yang lebih lengkap.
- Menambah validasi input jadwal.
- Meningkatkan sistem notifikasi.
- Menambahkan fitur reminder jadwal.
- Melengkapi dokumentasi deployment.
- Menambah E2E testing.

## 5. Backlog Penerus

1. Melengkapi functional dan E2E testing.
2. Menambah coverage pengujian Collision Engine.
3. Memperbaiki bug yang ditemukan saat review.
4. Melengkapi dokumentasi deployment.
5. Melakukan peningkatan UX/UI.
6. Mengembangkan fitur notifikasi dan reminder.

## 6. Pengembangan Lanjutan Hingga Desember

- Penyempurnaan UX/UI.
- Peningkatan sistem notifikasi.
- Fitur reminder jadwal.
- Peningkatan test coverage.
- Optimasi performa aplikasi.
- Penyempurnaan dokumentasi.
- Persiapan deployment.

## 7. Catatan untuk Pengembang Selanjutnya

Sebelum melanjutkan development:

1. Pull branch terbaru dari repository.
2. Pastikan `.env` sudah dikonfigurasi.
3. Jalankan `npm install`.
4. Jalankan aplikasi dengan `npm run dev`.
5. Jalankan functional test:

```bash
npx tsx test_collision.ts