"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useScheduleStore } from "@/store/useScheduleStore";
import { use } from "react";

const SEVERITY_COLOR: Record<string, string> = {
  tinggi: "#EF4444",
  sedang: "#F59E0B",
  rendah: "#6B7280",
};
const SEVERITY_BG: Record<string, string> = {
  tinggi: "#FEE2E2",
  sedang: "#FEF3C7",
  rendah: "#F3F4F6",
};
const SEVERITY_LABEL: Record<string, string> = {
  tinggi: "Kritis — Harus Diselesaikan Segera",
  sedang: "Sedang — Perlu Koordinasi & Perhatian",
  rendah: "Rendah — Bisa Dikompromikan",
};
const CATEGORY_COLOR: Record<string, string> = {
  kuliah: "#1A56DB",
  organisasi: "#7C3AED",
  lainnya: "#059669",
};
const CATEGORY_BG: Record<string, string> = {
  kuliah: "#EBF0FD",
  organisasi: "#EDE9FE",
  lainnya: "#D1FAE5",
};
const DAY_LABEL: Record<string, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

export default function ConflictDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const getConflictById = useScheduleStore((s) => s.getConflictById);
  const deleteSchedule = useScheduleStore((s) => s.deleteSchedule);

  const conflict = getConflictById(id);

  if (!conflict) {
    return (
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "60px 24px",
          textAlign: "center",
          border: "1px solid #E5E7EB",
          maxWidth: "600px",
          margin: "40px auto",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            background: "#ECFDF5",
            color: "#10B981",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
          Bentrokan Telah Terselesaikan!
        </h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
          Jadwal yang saling bertabrakan telah dihapus atau diperbarui.
        </p>
        <Link
          href="/calendar"
          style={{
            display: "inline-block",
            marginTop: 20,
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 700,
            background: "#1A56DB",
            color: "#FFFFFF",
            padding: "8px 20px",
            borderRadius: 8,
          }}
        >
          Kembali ke Kalender
        </Link>
      </div>
    );
  }

  const { scheduleA: a, scheduleB: b, severity, overlapStart, overlapEnd, day } = conflict;

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Back button */}
      <div>
        <Link
          href="/calendar"
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
          Kembali ke Kalender
        </Link>
      </div>

      {/* Severity Alert Banner */}
      <div
        style={{
          background: SEVERITY_BG[severity],
          border: `1.5px solid ${SEVERITY_COLOR[severity]}40`,
          borderRadius: 16,
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: SEVERITY_COLOR[severity],
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                color: SEVERITY_COLOR[severity],
              }}
            >
              Tingkat Konflik: {severity.toUpperCase()}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginTop: 2 }}>
              {SEVERITY_LABEL[severity]}
            </h2>
            <p style={{ fontSize: 13, color: "#4B5563", marginTop: 2 }}>
              Hari {DAY_LABEL[day]} · Interval bentrokan: <strong>{overlapStart} – {overlapEnd} WIB</strong>
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            background: "#FFFFFF",
            color: SEVERITY_COLOR[severity],
            padding: "8px 16px",
            borderRadius: 20,
            border: `1px solid ${SEVERITY_COLOR[severity]}60`,
          }}
        >
          Tabrakan Waktu Terdeteksi
        </span>
      </div>

      {/* Visual Timeline Comparison Bar */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E5E7EB",
          padding: "20px 24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>
          Visualisasi Waktu Tabrakan
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Schedule A Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", width: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {a.name}
            </span>
            <div style={{ flex: 1, background: "#F3F4F6", height: 26, borderRadius: 6, position: "relative", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  left: "10%",
                  width: "60%",
                  height: "100%",
                  background: "#1A56DB",
                  borderRadius: 6,
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 8,
                }}
              >
                {a.startTime} – {a.endTime}
              </div>
            </div>
          </div>

          {/* Overlap Window Highlight */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", width: 140 }}>
              Zona Konflik
            </span>
            <div style={{ flex: 1, background: "#F3F4F6", height: 16, borderRadius: 4, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: "40%",
                  width: "30%",
                  height: "100%",
                  background: "#EF4444",
                  borderRadius: 4,
                  color: "#FFFFFF",
                  fontSize: 9,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {overlapStart} – {overlapEnd}
              </div>
            </div>
          </div>

          {/* Schedule B Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", width: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {b.name}
            </span>
            <div style={{ flex: 1, background: "#F3F4F6", height: 26, borderRadius: 6, position: "relative", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  left: "40%",
                  width: "55%",
                  height: "100%",
                  background: "#7C3AED",
                  borderRadius: 6,
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 8,
                }}
              >
                {b.startTime} – {b.endTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side 2-Column Schedule Comparison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* Schedule A Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1.5px solid #E5E7EB",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: CATEGORY_BG[a.category],
                  color: CATEGORY_COLOR[a.category],
                }}
              >
                Jadwal A · {a.category}
              </span>
              {a.priority === "wajib" && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 6px", borderRadius: 4 }}>
                  Wajib
                </span>
              )}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>
              {a.name}
            </h3>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", fontSize: 13 }}>
                <span style={{ color: "#6B7280", width: 110 }}>Waktu:</span>
                <span style={{ fontWeight: 700, color: "#111827" }}>{a.startTime} – {a.endTime} WIB</span>
              </div>
              <div style={{ display: "flex", fontSize: 13 }}>
                <span style={{ color: "#6B7280", width: 110 }}>Lokasi:</span>
                <span style={{ fontWeight: 600, color: "#374151" }}>{a.location}</span>
              </div>
              {a.lecturer && (
                <div style={{ display: "flex", fontSize: 13 }}>
                  <span style={{ color: "#6B7280", width: 110 }}>Dosen / PIC:</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{a.lecturer}</span>
                </div>
              )}
              {a.notes && (
                <div style={{ display: "flex", fontSize: 13 }}>
                  <span style={{ color: "#6B7280", width: 110 }}>Catatan:</span>
                  <span style={{ color: "#4B5563" }}>{a.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 24, borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
            <button
              onClick={() => {
                if (confirm(`Hapus "${a.name}" dari jadwal untuk menyelesaikan bentrokan?`)) {
                  deleteSchedule(a.id);
                }
              }}
              style={{
                width: "100%",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                padding: "10px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Hapus Jadwal Ini (A)
            </button>
          </div>
        </div>

        {/* Schedule B Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1.5px solid #E5E7EB",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 8px",
                  borderRadius: 20,
                  background: CATEGORY_BG[b.category],
                  color: CATEGORY_COLOR[b.category],
                }}
              >
                Jadwal B · {b.category}
              </span>
              {b.priority === "wajib" && (
                <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 6px", borderRadius: 4 }}>
                  Wajib
                </span>
              )}
            </div>

            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>
              {b.name}
            </h3>

            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", fontSize: 13 }}>
                <span style={{ color: "#6B7280", width: 110 }}>Waktu:</span>
                <span style={{ fontWeight: 700, color: "#111827" }}>{b.startTime} – {b.endTime} WIB</span>
              </div>
              <div style={{ display: "flex", fontSize: 13 }}>
                <span style={{ color: "#6B7280", width: 110 }}>Lokasi:</span>
                <span style={{ fontWeight: 600, color: "#374151" }}>{b.location}</span>
              </div>
              {b.lecturer && (
                <div style={{ display: "flex", fontSize: 13 }}>
                  <span style={{ color: "#6B7280", width: 110 }}>Dosen / PIC:</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{b.lecturer}</span>
                </div>
              )}
              {b.notes && (
                <div style={{ display: "flex", fontSize: 13 }}>
                  <span style={{ color: "#6B7280", width: 110 }}>Catatan:</span>
                  <span style={{ color: "#4B5563" }}>{b.notes}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ marginTop: 24, borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
            <button
              onClick={() => {
                if (confirm(`Hapus "${b.name}" dari jadwal untuk menyelesaikan bentrokan?`)) {
                  deleteSchedule(b.id);
                }
              }}
              style={{
                width: "100%",
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                color: "#DC2626",
                padding: "10px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              Hapus Jadwal Ini (B)
            </button>
          </div>
        </div>
      </div>

      {/* Smart Resolution Suggestions */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E5E7EB",
          padding: "24px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 14 }}>
          Rekomendasi Solusi Pintar (Collision Radar Advice)
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          <div
            style={{
              background: "#F9FAFB",
              borderRadius: 12,
              padding: "16px",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>
              1. Pindah Kelas Paralel
            </div>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
              Jika salah satu adalah mata kuliah wajib, tanyakan ke bagian akademik mengenai slot kelas paralel di hari lain.
            </p>
          </div>

          <div
            style={{
              background: "#F9FAFB",
              borderRadius: 12,
              padding: "16px",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>
              2. Delegasi Kegiatan
            </div>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
              Untuk kegiatan organisasi atau kepanitiaan, koordinasikan dengan wakil atau rekan divisi untuk mewakili kehadiranmu.
            </p>
          </div>

          <div
            style={{
              background: "#F9FAFB",
              borderRadius: 12,
              padding: "16px",
              border: "1px solid #E5E7EB",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>
              3. Izin Dispensasi Resmi
            </div>
            <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
              Ajukan surat dispensasi kehadiran resmi jika bentrokan disebabkan oleh penugasan kampus yang bersifat institusional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
