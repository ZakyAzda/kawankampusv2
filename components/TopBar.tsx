"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScheduleStore } from "@/store/useScheduleStore";
import { DUMMY_USER } from "@/data/schedules";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/home": {
    title: "Dashboard",
    subtitle: "Ringkasan jadwal dan deteksi bentrokan terkini",
  },
  "/calendar": {
    title: "Kalender Harian",
    subtitle: "Kelola dan tinjau agenda berdasarkan hari",
  },
  "/weekly": {
    title: "Tampilan Mingguan",
    subtitle: "Peta waktu visual seluruh jadwal dalam satu minggu",
  },
  "/add": {
    title: "Tambah Jadwal Baru",
    subtitle: "Daftarkan mata kuliah, rapat organisasi, atau kegiatan lain",
  },
  "/profile": {
    title: "Profil Mahasiswa",
    subtitle: "Informasi akun dan statistik penggunaan jadwal",
  },
};

export default function TopBar() {
  const pathname = usePathname();
  const { conflicts } = useScheduleStore();

  const isConflictPage = pathname.startsWith("/conflict/");
  const meta = isConflictPage
    ? { title: "Detail Bentrokan", subtitle: "Analisis konflik jadwal dan rekomendasi solusi" }
    : PAGE_TITLES[pathname] || { title: "Collision Radar", subtitle: "Sistem Deteksi Bentrokan Jadwal" };

  return (
    <header
      style={{
        background: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
          {meta.title}
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
          {meta.subtitle}
        </p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Conflict indicator alert */}
        {conflicts.length > 0 ? (
          <Link
            href="/calendar"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "#FEE2E2",
              border: "1px solid #FECACA",
              padding: "7px 14px",
              borderRadius: 20,
              color: "#991B1B",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#EF4444",
                display: "inline-block",
              }}
              className="pulse"
            />
            {conflicts.length} Konflik Jadwal
          </Link>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              padding: "7px 14px",
              borderRadius: 20,
              color: "#065F46",
              fontSize: 12,
              fontWeight: 600,
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
            Jadwal Aman
          </div>
        )}

        {/* Quick Add Button */}
        {pathname !== "/add" && (
          <Link
            href="/add"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#1A56DB",
              color: "#FFFFFF",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 1px 3px rgba(26, 86, 219, 0.2)",
            }}
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Tambah Jadwal
          </Link>
        )}

        {/* User preview */}
        <Link
          href="/profile"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "4px 8px",
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            background: "#F9FAFB",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#1A56DB",
              color: "#FFFFFF",
              fontSize: 13,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {DUMMY_USER.name.charAt(0)}
          </div>
          <div style={{ textAlign: "left", lineHeight: 1.2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>
              {DUMMY_USER.name}
            </div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>
              {DUMMY_USER.nim}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
}
