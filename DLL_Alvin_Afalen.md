# DLL Peserta — Alvin Afalen

## 1. Fokus Kerja

Fokus pekerjaan saya dalam project Kawan Kampus adalah pada **Functional Test P0 untuk Collision Engine**.

Saya melakukan pengujian terhadap fitur yang berhubungan dengan deteksi bentrok jadwal dan validasi waktu. Pengujian dilakukan menggunakan lima skenario:

1. No Conflict
2. Exact Boundary
3. Partial Overlap
4. Containment
5. Invalid Time Input

Selain melakukan pengujian, saya juga membuat dokumentasi hasil pengujian pada `03_FunctionalTest_P0.md` dan dokumentasi kontribusi individual pada `05_Contribution_Individual.md`.

## 2. Hasil Pekerjaan

Dari lima skenario yang diuji:

- B-01 — PASS
- B-02 — PASS
- B-03 — PASS
- B-04 — PASS
- B-05 — PASS

Total hasil pengujian adalah **5 PASS dan 0 FAIL**.

## 3. Pelajaran Teknis

Selama mengerjakan bagian ini, saya mempelajari beberapa hal:

- Cara kerja logika deteksi bentrok jadwal.
- Cara menentukan apakah dua rentang waktu saling overlap.
- Cara menghitung durasi waktu yang mengalami bentrok.
- Pentingnya menguji kondisi boundary ketika waktu selesai satu kegiatan sama dengan waktu mulai kegiatan lain.
- Pentingnya melakukan validasi terhadap input waktu yang tidak valid.
- Penggunaan TypeScript dan `tsx` untuk menjalankan pengujian.
- Penggunaan Git branch, commit, push, dan Pull Request dalam workflow pengembangan project.

## 4. Kendala Nyata

Kendala yang saya alami adalah file `03_FunctionalTest_P0.md` sempat dibuat dalam kondisi kosong ketika melakukan commit pertama.

Akibatnya, commit pertama hanya membuat file tanpa memasukkan isi dokumentasi.

Selain itu, saya juga perlu memahami alur Git karena awalnya repository sudah memiliki folder project sehingga tidak perlu melakukan clone ulang. Repository yang sudah ada kemudian digunakan dan diperbarui menggunakan Git.

## 5. Penyelesaian Kendala

Untuk mengatasi masalah file kosong, saya memeriksa kembali isi file, kemudian mengisi dokumentasi berdasarkan hasil pengujian yang benar-benar dijalankan.

Setelah itu saya melakukan commit perbaikan dan push ke branch:

`feature/functional-test-alvin`

Saya kemudian membuat Pull Request menuju branch `main`.

## 6. Rencana Perbaikan

Untuk pengembangan berikutnya, saya ingin:

- Menambah lebih banyak test case untuk Collision Engine.
- Menguji kondisi jadwal dengan variasi tanggal dan waktu yang lebih banyak.
- Menguji kasus input yang lebih ekstrem atau tidak sesuai format.
- Membuat pengujian otomatis agar test dapat dijalankan dengan lebih mudah.
- Meningkatkan pemahaman terhadap workflow Git dan Pull Request.
- Membuat dokumentasi pengujian yang lebih terstruktur dan mudah dipahami oleh reviewer.

## 7. Refleksi

Pengerjaan ini memberikan pengalaman dalam melakukan pengujian terhadap fitur yang sudah dibuat sekaligus mendokumentasikan hasilnya. Saya juga belajar bahwa hasil test perlu didukung dengan bukti yang jelas dan setiap kontribusi sebaiknya tercatat melalui Git agar dapat ditelusuri oleh anggota tim maupun reviewer.