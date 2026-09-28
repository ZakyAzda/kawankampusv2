"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useScheduleStore } from "@/store/useScheduleStore";
import { ScheduleItem } from "@/data/schedules";

type Category = "kuliah" | "organisasi" | "lainnya";
type Priority = "wajib" | "fleksibel";
type Day = "senin" | "selasa" | "rabu" | "kamis" | "jumat" | "sabtu" | "minggu";

const DAYS: Day[] = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
const DAY_LABEL: Record<Day, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

const CATEGORIES: { id: Category; label: string; desc: string }[] = [
  { id: "kuliah", label: "Mata Kuliah", desc: "Perkuliahan, responsi, atau praktikum lab" },
  { id: "organisasi", label: "Organisasi", desc: "Rapat, kepanitiaan, atau program kerja" },
  { id: "lainnya", label: "Lainnya", desc: "Aktivitas pribadi, olahraga, atau istirahat" },
];

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function AddPage() {
  const router = useRouter();
  const { schedules, addSchedule } = useScheduleStore();

  const [form, setForm] = useState<{
    name: string;
    category: Category;
    day: Day;
    startTime: string;
    endTime: string;
    location: string;
    lecturer: string;
    notes: string;
    priority: Priority;
    isRoutine: boolean;
  }>({
    name: "",
    category: "kuliah",
    day: "senin",
    startTime: "08:00",
    endTime: "10:00",
    location: "",
    lecturer: "",
    notes: "",
    priority: "wajib",
    isRoutine: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live Conflict Check before saving!
  const potentialConflicts = useMemo(() => {
    if (!form.startTime || !form.endTime) return [];
    const sStart = toMinutes(form.startTime);
    const sEnd = toMinutes(form.endTime);
    if (sStart >= sEnd) return [];

    return schedules.filter((s) => {
      if (s.day !== form.day) return false;
      const existStart = toMinutes(s.startTime);
      const existEnd = toMinutes(s.endTime);
      return sStart < existEnd && sEnd > existStart;
    });
  }, [form.day, form.startTime, form.endTime, schedules]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Nama jadwal wajib diisi";
    if (!form.location.trim()) errs.location = "Lokasi atau ruangan wajib diisi";
    if (toMinutes(form.startTime) >= toMinutes(form.endTime)) {
      errs.time = "Waktu selesai harus lebih lambat dari waktu mulai";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    addSchedule({
      name: form.name.trim(),
      category: form.category,
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location.trim(),
      lecturer: form.lecturer.trim() || undefined,
      notes: form.notes.trim() || undefined,
      priority: form.priority,
      isRoutine: form.isRoutine,
    });

    router.push("/calendar");
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Back button */}
      <div>
        <Link
          href="/home"
          style={{
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 600,
            color: "#6B7280",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Kembali ke Dashboard
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E5E7EB",
          padding: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
            Pendaftaran Jadwal Baru
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
            Sistem Collision Radar akan otomatis menganalisis bentrokan waktu secara langsung.
          </p>
        </div>

        {/* Section 1: Nama & Kategori */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 14 }}>
            1. Informasi Utama
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Nama Jadwal / Mata Kuliah <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Pemrograman Berorientasi Objek"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: errors.name ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.name && (
                <div style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.name}</div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Kategori Kegiatan
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 12,
                }}
              >
                {CATEGORIES.map((cat) => {
                  const active = form.category === cat.id;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setForm({ ...form, category: cat.id })}
                      style={{
                        padding: "12px 14px",
                        borderRadius: 10,
                        border: active ? "2px solid #1A56DB" : "1.5px solid #E5E7EB",
                        background: active ? "#EBF0FD" : "#FFFFFF",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: active ? "#1A56DB" : "#111827",
                        }}
                      >
                        {cat.label}
                      </div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                        {cat.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Hari & Waktu */}
        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 14 }}>
            2. Hari & Waktu Pelaksanaan
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Day Selector */}
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 8 }}>
                Pilih Hari
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: 8,
                }}
              >
                {DAYS.map((d) => {
                  const active = form.day === d;
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => setForm({ ...form, day: d })}
                      style={{
                        padding: "10px 6px",
                        borderRadius: 8,
                        border: active ? "1.5px solid #1A56DB" : "1px solid #E5E7EB",
                        background: active ? "#1A56DB" : "#F9FAFB",
                        color: active ? "#FFFFFF" : "#374151",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                        textAlign: "center",
                      }}
                    >
                      {DAY_LABEL[d]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time inputs */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Waktu Mulai (WIB)
                </label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                  Waktu Selesai (WIB)
                </label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: 10,
                    border: "1.5px solid #E5E7EB",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            </div>

            {errors.time && (
              <div style={{ fontSize: 12, color: "#EF4444" }}>{errors.time}</div>
            )}

            {/* LIVE CONFLICT PREVIEW BOX */}
            {potentialConflicts.length > 0 ? (
              <div
                style={{
                  background: "#FEF2F2",
                  border: "1.5px solid #FCA5A5",
                  borderRadius: 12,
                  padding: "16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "#EF4444",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#991B1B" }}>
                    Radar Mendeteksi Bentrokan Waktu!
                  </div>
                  <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 4, lineHeight: 1.5 }}>
                    Jadwal yang kamu daftarkan bertabrakan dengan{" "}
                    <strong>{potentialConflicts.map((p) => `"${p.name}" (${p.startTime}–${p.endTime})`).join(", ")}</strong>{" "}
                    pada hari {DAY_LABEL[form.day]}. Kamu tetap dapat menyimpannya untuk dianalisis di dashboard.
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#ECFDF5",
                  border: "1px solid #A7F3D0",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "#065F46",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#10B981",
                    display: "inline-block",
                  }}
                />
                Waktu ini tersedia dan bebas dari bentrokan dengan jadwal yang sudah ada.
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Detail Ruang & Dosen */}
        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 14 }}>
            3. Lokasi & Penanggung Jawab
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Lokasi / Ruangan <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Lab Komputer 3 Lt. 2"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: errors.location ? "1.5px solid #EF4444" : "1.5px solid #E5E7EB",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              {errors.location && (
                <div style={{ fontSize: 11, color: "#EF4444", marginTop: 4 }}>{errors.location}</div>
              )}
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Dosen Pengampu / Penanggung Jawab (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Dr. Hendra, S.T."
                value={form.lecturer}
                onChange={(e) => setForm({ ...form, lecturer: e.target.value })}
                style={{
                  width: "100%",
                  padding: "11px 14px",
                  borderRadius: 10,
                  border: "1.5px solid #E5E7EB",
                  fontSize: 14,
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Catatan Tambahan (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Membawa laptop dan materi modul praktikum"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 10,
                border: "1.5px solid #E5E7EB",
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Section 4: Prioritas & Rutinitas */}
        <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 14 }}>
            4. Pengaturan Prioritas
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
            }}
          >
            {/* Priority Selector */}
            <div
              style={{
                background: "#F9FAFB",
                padding: "16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>
                Tingkat Prioritas
              </div>
              <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2, marginBottom: 10 }}>
                Menentukan tingkat keparahan bentrokan (Kritis vs Sedang)
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {(["wajib", "fleksibel"] as Priority[]).map((p) => {
                  const active = form.priority === p;
                  return (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setForm({ ...form, priority: p })}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: active ? "1.5px solid #1A56DB" : "1px solid #E5E7EB",
                        background: active ? "#1A56DB" : "#FFFFFF",
                        color: active ? "#FFFFFF" : "#374151",
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "capitalize",
                        cursor: "pointer",
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Routine Switch */}
            <div
              style={{
                background: "#F9FAFB",
                padding: "16px",
                borderRadius: 12,
                border: "1px solid #E5E7EB",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>
                  Kegiatan Rutin Mingguan
                </div>
                <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                  Berulang di hari yang sama setiap minggunya
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                {[
                  { val: true, label: "Ya, Rutin" },
                  { val: false, label: "Hanya Sekali" },
                ].map((item) => {
                  const active = form.isRoutine === item.val;
                  return (
                    <button
                      type="button"
                      key={item.label}
                      onClick={() => setForm({ ...form, isRoutine: item.val })}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: active ? "1.5px solid #1A56DB" : "1px solid #E5E7EB",
                        background: active ? "#1A56DB" : "#FFFFFF",
                        color: active ? "#FFFFFF" : "#374151",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit and Cancel Buttons */}
        <div
          style={{
            borderTop: "1px solid #F3F4F6",
            paddingTop: 24,
            display: "flex",
            justifyContent: "flex-end",
            gap: 12,
          }}
        >
          <Link
            href="/calendar"
            style={{
              textDecoration: "none",
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              background: "#FFFFFF",
              color: "#374151",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: "10px 24px",
              borderRadius: 8,
              border: "none",
              background: "#1A56DB",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(26, 86, 219, 0.25)",
            }}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
          </button>
        </div>
      </form>
    </div>
  );
}
