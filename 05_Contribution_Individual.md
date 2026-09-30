# Contribution Individual

## Alvin Afalen

### 1. Kontribusi

Saya mengerjakan bagian **Functional Test P0 pada Collision Engine** untuk memastikan sistem dapat mendeteksi kondisi bentrok jadwal dan melakukan validasi waktu dengan benar.

### 2. Modul yang Dikerjakan

**Modul:**

* Collision Engine
* Functional Test P0

**File yang digunakan:**

* `lib/collisionEngine.ts`
* `test_collision.ts`

**Dokumentasi yang dibuat:**

* `03_FunctionalTest_P0.md`

### 3. Skenario Pengujian

Pengujian dilakukan menggunakan lima skenario:

| ID   | Skenario           | Hasil |
| ---- | ------------------ | ----- |
| B-01 | No Conflict        | PASS  |
| B-02 | Exact Boundary     | PASS  |
| B-03 | Partial Overlap    | PASS  |
| B-04 | Containment        | PASS  |
| B-05 | Invalid Time Input | PASS  |

**Total:** 5 test
**PASS:** 5
**FAIL:** 0
**Persentase:** 100%

### 4. Perintah Pengujian

Pengujian dijalankan menggunakan:

```bash
npx tsx test_collision.ts
```

Hasil pengujian menunjukkan seluruh test case berhasil mendapatkan status PASS.

### 5. Git Contribution

**Branch:**

```text
feature/functional-test-alvin
```

**Commit:**

```text
0366a13
```

**Commit message:**

```text
docs: complete P0 functional tests
```

**Repository:**

```text
https://github.com/ZakyAzda/kawankampusv2
```

**Pull Request:**

### 5. Pull Request

https://github.com/ZakyAzda/kawankampusv2/pull/2

### 6. Kendala yang Dihadapi

Pada awal pengerjaan, file `03_FunctionalTest_P0.md` sempat dibuat dalam kondisi kosong sehingga commit pertama hanya membuat file tanpa isi.

Masalah tersebut diperbaiki dengan mengisi dokumentasi Functional Test P0, kemudian melakukan commit perbaikan sehingga file berisi seluruh hasil pengujian.

### 7. Solusi

Langkah penyelesaian yang dilakukan:

1. Memeriksa isi file Functional Test.
2. Mengisi dokumentasi berdasarkan hasil pengujian aktual.
3. Melakukan `git add`.
4. Membuat commit perbaikan.
5. Membuat branch khusus kontribusi Alvin.
6. Melakukan push branch ke repository GitHub.

### 8. Pembelajaran Teknis

Dari pengerjaan ini saya mempelajari:

* Pengujian fungsi Collision Engine menggunakan beberapa kondisi jadwal.
* Validasi waktu mulai dan waktu selesai.
* Pengujian kondisi overlap jadwal.
* Penggunaan TypeScript dan `tsx` untuk menjalankan test.
* Penggunaan Git branch untuk memisahkan kontribusi.
* Membuat commit dan melakukan push branch ke GitHub.
