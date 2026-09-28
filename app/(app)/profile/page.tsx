"use client";

import React from "react";
import { DUMMY_USER } from "@/data/schedules";
import { useScheduleStore } from "@/store/useScheduleStore";

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

export default function ProfilePage() {
  const { schedules, conflicts } = useScheduleStore();

  const totalKuliah = schedules.filter((s) => s.category === "kuliah").length;
  const totalOrg = schedules.filter((s) => s.category === "organisasi").length;
  const totalLain = schedules.filter((s) => s.category === "lainnya").length;

  const conflictingCount = new Set(
    conflicts.flatMap((c) => [c.scheduleA.id, c.scheduleB.id])
  ).size;
  const safeSchedules = Math.max(0, schedules.length - conflictingCount);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 2-Column Desktop Profile Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left Column: Profile Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {/* Header background pattern */}
          <div
            style={{
              height: 110,
              background: "linear-gradient(135deg, #1A56DB 0%, #1440A8 100%)",
              position: "relative",
            }}
          />

          {/* Profile details */}
          <div style={{ padding: "0 24px 28px", textAlign: "center", position: "relative" }}>
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "4px solid #FFFFFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "-40px auto 14px",
                fontSize: 32,
                fontWeight: 800,
                color: "#1A56DB",
              }}
            >
              {DUMMY_USER.name.charAt(0)}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>
              {DUMMY_USER.name}
            </h2>
            <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
              NIM: {DUMMY_USER.nim}
            </p>

            <div
              style={{
                display: "inline-block",
                marginTop: 8,
                fontSize: 11,
                fontWeight: 700,
                color: "#065F46",
                background: "#ECFDF5",
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              Mahasiswa Aktif
            </div>

            {/* Academic Details List */}
            <div
              style={{
                marginTop: 24,
                borderTop: "1px solid #F3F4F6",
                paddingTop: 18,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                { label: "Universitas", value: DUMMY_USER.university },
                { label: "Fakultas", value: DUMMY_USER.faculty },
                { label: "Semester", value: `Semester ${DUMMY_USER.semester}` },
                { label: "Tahun Angkatan", value: `${DUMMY_USER.angkatan}` },
                { label: "Email Kampus", value: `user@ui.ac.id` },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: "#6B7280" }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: "#111827" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & System Status */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Key Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "20px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Total Jadwal</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginTop: 8 }}>
                {schedules.length}
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Agenda aktif terdaftar</div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "20px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Jadwal Aman</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#10B981", marginTop: 8 }}>
                {safeSchedules}
              </div>
              <div style={{ fontSize: 12, color: "#059669", marginTop: 2 }}>Tanpa bentrokan waktu</div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "20px",
                border: conflicts.length > 0 ? "1px solid #FECACA" : "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Konflik Aktif</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: conflicts.length > 0 ? "#EF4444" : "#10B981",
                  marginTop: 8,
                }}
              >
                {conflicts.length}
              </div>
              <div style={{ fontSize: 12, color: conflicts.length > 0 ? "#DC2626" : "#059669", marginTop: 2 }}>
                {conflicts.length > 0 ? "Perlu penyelesaian" : "Jadwal optimal"}
              </div>
            </div>
          </div>

          {/* Category Distribution Breakdown */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid #E5E7EB",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 18 }}>
              Rincian Kategori Jadwal
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  label: "Mata Kuliah Reguler & Praktikum",
                  count: totalKuliah,
                  color: "#1A56DB",
                  pct: schedules.length ? Math.round((totalKuliah / schedules.length) * 100) : 0,
                },
                {
                  label: "Kegiatan Organisasi & Kepanitiaan",
                  count: totalOrg,
                  color: "#7C3AED",
                  pct: schedules.length ? Math.round((totalOrg / schedules.length) * 100) : 0,
                },
                {
                  label: "Aktivitas Pribadi & Olahraga",
                  count: totalLain,
                  color: "#059669",
                  pct: schedules.length ? Math.round((totalLain / schedules.length) * 100) : 0,
                },
              ].map((item) => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                    <span style={{ fontWeight: 600, color: "#374151" }}>{item.label}</span>
                    <span style={{ fontWeight: 700, color: "#111827" }}>
                      {item.count} Jadwal ({item.pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      height: 10,
                      borderRadius: 5,
                      background: "#F3F4F6",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${item.pct}%`,
                        height: "100%",
                        background: item.color,
                        borderRadius: 5,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collision Radar System Info */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid #E5E7EB",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
              Status Mesin Collision Radar
            </h3>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
              Algoritma pendeteksi bentrokan waktu berjalan secara client-side menggunakan Zustand state management.
              Sistem secara otomatis mengevaluasi interval waktu mulai dan selesai setiap kali terdapat penambahan atau perubahan jadwal.
            </p>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#F9FAFB",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Engine Status</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#059669", marginTop: 2 }}>
                  Aktif (Client-Side Detection)
                </div>
              </div>

              <div
                style={{
                  background: "#F9FAFB",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Toleransi Waktu</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginTop: 2 }}>
                  0 Menit (Exact Interval Overlap)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
