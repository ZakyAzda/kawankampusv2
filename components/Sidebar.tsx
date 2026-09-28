"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { DUMMY_USER } from "@/data/schedules";
import { useScheduleStore } from "@/store/useScheduleStore";

const NAV_ITEMS = [
  {
    href: "/home",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Kalender",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/weekly",
    label: "Tampilan Mingguan",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    href: "/add",
    label: "Tambah Jadwal",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v8M8 12h8" strokeLinecap="round" />
      </svg>
    ),
    accent: true,
  },
  {
    href: "/profile",
    label: "Profil",
    icon: (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { conflicts } = useScheduleStore();

  return (
    <aside
      style={{
        width: "240px",
        minHeight: "100vh",
        background: "#FFFFFF",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #1A56DB, #1440A8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1F2937", lineHeight: 1.2 }}>
              Collision Radar
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 500 }}>
              Deteksi Bentrokan Jadwal
            </div>
          </div>
        </div>
      </div>

      {/* Conflict badge */}
      {conflicts.length > 0 && (
        <div style={{ margin: "12px 16px 0" }}>
          <div style={{
            background: "#FEE2E2", borderRadius: 10,
            padding: "10px 12px",
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid #FECACA",
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "#EF4444",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#991B1B" }}>
                {conflicts.length} Bentrokan
              </div>
              <div style={{ fontSize: 10, color: "#B91C1C" }}>Perlu ditangani</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: "#9CA3AF", marginBottom: 8, paddingLeft: 8 }}>
          Menu Utama
        </div>
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none", display: "block", marginBottom: 2 }}
            >
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10,
                background: item.accent
                  ? active ? "#1A56DB" : "transparent"
                  : active ? "#EBF0FD" : "transparent",
                color: item.accent
                  ? active ? "#FFFFFF" : "#1A56DB"
                  : active ? "#1A56DB" : "#6B7280",
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                transition: "all 0.15s",
                border: item.accent && !active ? "1.5px dashed #C7D2FE" : "1.5px solid transparent",
              }}>
                {item.icon}
                {item.label}
                {item.accent && !active && (
                  <span style={{
                    marginLeft: "auto", fontSize: 9, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 99,
                    background: "#1A56DB", color: "#fff",
                  }}>
                    + Baru
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User info at bottom */}
      <div style={{ padding: "16px", borderTop: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 17,
            background: "linear-gradient(135deg, #1A56DB, #7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "#FFFFFF", flexShrink: 0,
          }}>
            {DUMMY_USER.name.charAt(0)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1F2937", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {DUMMY_USER.name}
            </div>
            <div style={{ fontSize: 10, color: "#9CA3AF" }}>
              Smt {DUMMY_USER.semester} · {DUMMY_USER.faculty.split(" ")[0]}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
