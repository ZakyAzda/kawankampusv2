# Functional Test P0 — Collision Engine

## 1. Informasi Pengujian

* **Nama:** Alvin Afalen
* **Modul:** Collision Engine
* **File Pengujian:** `test_collision.ts`
* **Runtime:** TypeScript menggunakan `tsx`
* **Perintah Pengujian:** `npx tsx test_collision.ts`

## 2. Tujuan Pengujian

Pengujian ini dilakukan untuk memastikan fitur Collision Engine dapat mendeteksi bentrok jadwal dengan benar, menangani batas waktu yang sama, menghitung durasi bentrok, serta memvalidasi input waktu yang tidak valid.

## 3. Hasil Functional Test

### B-01 — No Conflict

**Input:**

* Kegiatan A: 08:00–10:30
* Kegiatan B: 13:00–15:00
* Tanggal: 28 September 2026

**Expected Result:**
Tidak terjadi bentrok karena waktu kedua kegiatan tidak saling beririsan.

**Actual Result:**
Collision Engine menyatakan tidak terjadi collision.

**Status:** PASS

---

### B-02 — Exact Boundary

**Input:**

* Kegiatan A: 09:00–11:30
* Kegiatan B: 11:30–14:00
* Tanggal: 28 September 2026

**Expected Result:**
Tidak terjadi bentrok karena kegiatan pertama berakhir tepat pada waktu kegiatan kedua dimulai.

**Actual Result:**
Collision Engine menyatakan tidak terjadi collision.

**Status:** PASS

---

### B-03 — Partial Overlap

**Input:**

* Kegiatan A: 13:00–15:00
* Kegiatan B: 14:00–16:00
* Tanggal: 28 September 2026

**Expected Result:**
Sistem mendeteksi bentrok selama 60 menit.

**Actual Result:**
Collision Engine mendeteksi collision dengan durasi overlap 60 menit.

**Status:** PASS

---

### B-04 — Containment

**Input:**

* Kegiatan A: 09:00–11:00
* Kegiatan B: 08:00–11:30
* Tanggal: 28 September 2026

**Expected Result:**
Sistem mendeteksi bentrok selama 120 menit karena seluruh waktu Kegiatan A berada di dalam rentang waktu Kegiatan B.

**Actual Result:**
Collision Engine mendeteksi collision dengan durasi overlap 120 menit.

**Status:** PASS

---

### B-05 — Invalid Time Input

**Input:**

* Start Time: 15:00
* End Time: 13:00

**Expected Result:**
Input dinyatakan tidak valid karena waktu mulai lebih besar daripada waktu selesai.

**Actual Result:**
Fungsi validasi menyatakan input waktu tidak valid.

**Status:** PASS

## 4. Rekapitulasi Hasil

| ID   | Skenario           | Expected          | Actual            | Status |
| ---- | ------------------ | ----------------- | ----------------- | ------ |
| B-01 | No Conflict        | Tidak ada bentrok | Tidak ada bentrok | PASS   |
| B-02 | Exact Boundary     | Tidak ada bentrok | Tidak ada bentrok | PASS   |
| B-03 | Partial Overlap    | Bentrok 60 menit  | Bentrok 60 menit  | PASS   |
| B-04 | Containment        | Bentrok 120 menit | Bentrok 120 menit | PASS   |
| B-05 | Invalid Time Input | Input tidak valid | Input tidak valid | PASS   |

**Total Test:** 5
**PASS:** 5
**FAIL:** 0
**Persentase Keberhasilan:** 100%

## 5. Output Pengujian

```text
B-01 (08.00-10.30 vs 13.00-15.00): PASS
B-02 (09.00-11.30 vs 11.30-14.00): PASS
B-03 (13.00-15.00 vs 14.00-16.00): PASS
B-04 (09.00-11.00 di dalam 08.00-11.30): PASS
B-05 (Start 15.00, End 13.00): PASS
```

## 6. Bukti Pengujian

Lampirkan screenshot terminal yang menunjukkan hasil pengujian B-01 sampai B-05 dengan status PASS.

## 7. Kesimpulan

Berdasarkan lima skenario pengujian yang telah dilakukan, seluruh test case berhasil mendapatkan status PASS.

Collision Engine mampu menangani jadwal yang tidak bertabrakan, jadwal dengan batas waktu yang sama, bentrok sebagian, bentrok karena containment, serta validasi input waktu yang tidak sesuai.

Dengan demikian, Collision Engine yang diuji telah berjalan sesuai dengan skenario pengujian yang telah ditentukan.
