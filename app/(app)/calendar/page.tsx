"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useScheduleStore } from "@/store/useScheduleStore";
import { ConflictPair, ScheduleItem } from "@/data/schedules";

const DAY_ORDER = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
const DAY_LABEL: Record<string, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
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

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export default function CalendarPage() {
  const { schedules, conflicts, deleteSchedule } = useScheduleStore();
  const [selectedDay, setSelectedDay] = useState("kamis");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const daySchedules = useMemo(() => {
    return schedules
      .filter((s) => s.day === selectedDay)
      .filter((s) => (categoryFilter === "all" ? true : s.category === categoryFilter))
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [schedules, selectedDay, categoryFilter]);

  const dayConflicts = useMemo(
    () => conflicts.filter((c) => c.day === selectedDay),
    [conflicts, selectedDay]
  );

  const conflictsByDay = useMemo(() => {
    const map: Record<string, number> = {};
    conflicts.forEach((c) => {
      map[c.day] = (map[c.day] || 0) + 1;
    });
    return map;
  }, [conflicts]);

  const scheduleCountByDay = useMemo(() => {
    const map: Record<string, number> = {};
    schedules.forEach((s) => {
      map[s.day] = (map[s.day] || 0) + 1;
    });
    return map;
  }, [schedules]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 7-Day Desktop Selector */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "16px",
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 10,
          }}
        >
          {DAY_ORDER.map((day) => {
            const active = selectedDay === day;
            const conflictCount = conflictsByDay[day] || 0;
            const schedCount = scheduleCountByDay[day] || 0;

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  background: active ? "#1A56DB" : "#F9FAFB",
                  color: active ? "#FFFFFF" : "#1F2937",
                  border: active ? "1.5px solid #1A56DB" : "1px solid #E5E7EB",
                  borderRadius: 12,
                  padding: "14px 10px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  transition: "all 0.15s ease",
                  boxShadow: active ? "0 4px 12px rgba(26, 86, 219, 0.25)" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    letterSpacing: 0.2,
                  }}
                >
                  {DAY_LABEL[day]}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: active ? "rgba(255, 255, 255, 0.8)" : "#6B7280",
                    fontWeight: 500,
                  }}
                >
                  {schedCount} Jadwal
                </span>

                {conflictCount > 0 && (
                  <span
                    style={{
                      marginTop: 2,
                      fontSize: 10,
                      fontWeight: 700,
                      background: active ? "#FEE2E2" : "#EF4444",
                      color: active ? "#DC2626" : "#FFFFFF",
                      padding: "2px 8px",
                      borderRadius: 10,
                    }}
                  >
                    {conflictCount} bentrok
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Controls Bar: Category Filters & Add Button */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {/* Category Filter Pills */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#6B7280", fontWeight: 600, marginRight: 4 }}>
              Filter:
            </span>
            {[
              { id: "all", label: "Semua Kategori" },
              { id: "kuliah", label: "Mata Kuliah" },
              { id: "organisasi", label: "Organisasi" },
              { id: "lainnya", label: "Lainnya" },
            ].map((cat) => {
              const active = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    background: active ? "#1A56DB" : "#FFFFFF",
                    color: active ? "#FFFFFF" : "#4B5563",
                    border: active ? "1px solid #1A56DB" : "1px solid #E5E7EB",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Quick Add for current selected day */}
          <Link
            href={`/add`}
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "#FFFFFF",
              border: "1px solid #1A56DB",
              color: "#1A56DB",
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Tambah Jadwal Baru
          </Link>
        </div>

        {/* Conflict Alert Banner for selected day if any */}
        {dayConflicts.length > 0 && (
          <div
            style={{
              background: "#FEF2F2",
              border: "1.5px solid #FCA5A5",
              borderRadius: 14,
              padding: "18px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: "#EF4444",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B" }}>
                  Terdeteksi {dayConflicts.length} Bentrokan di Hari {DAY_LABEL[selectedDay]}!
                </div>
                <div style={{ fontSize: 12, color: "#B91C1C", marginTop: 2 }}>
                  Silakan tinjau jadwal yang bertabrakan di bawah ini untuk menghindari ketidakhadiran kuliah atau rapat.
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: 12,
              }}
            >
              {dayConflicts.map((c) => (
                <div
                  key={c.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #FECACA",
                    borderRadius: 10,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: SEVERITY_COLOR[c.severity],
                        background: SEVERITY_BG[c.severity],
                        padding: "2px 6px",
                        borderRadius: 4,
                      }}
                    >
                      Tingkat {c.severity}
                    </span>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginTop: 4 }}>
                      {c.scheduleA.name} ✕ {c.scheduleB.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                      Waktu Tabrakan: {c.overlapStart} – {c.overlapEnd} WIB
                    </div>
                  </div>

                  <Link
                    href={`/conflict/${c.id}`}
                    style={{
                      textDecoration: "none",
                      fontSize: 12,
                      fontWeight: 700,
                      background: "#1A56DB",
                      color: "#FFFFFF",
                      padding: "6px 12px",
                      borderRadius: 6,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Atasi Bentrokan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule List for Selected Day */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            padding: "24px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
              borderBottom: "1px solid #F3F4F6",
              paddingBottom: 14,
            }}
          >
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
                Agenda {DAY_LABEL[selectedDay]}
              </h2>
              <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                {daySchedules.length} kegiatan terdaftar
              </p>
            </div>
          </div>

          {daySchedules.length === 0 ? (
            <div
              style={{
                padding: "48px 24px",
                textAlign: "center",
                background: "#F9FAFB",
                borderRadius: 12,
                border: "1px dashed #D1D5DB",
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: "#4B5563" }}>
                Tidak ada kegiatan untuk hari {DAY_LABEL[selectedDay]}
              </div>
              <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
                {categoryFilter !== "all"
                  ? "Coba ubah filter kategori atau tambahkan jadwal baru."
                  : "Hari ini bebas agenda perkuliahan dan kegiatan."}
              </p>
              <Link
                href="/add"
                style={{
                  display: "inline-block",
                  marginTop: 16,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  background: "#1A56DB",
                  color: "#FFFFFF",
                  padding: "8px 18px",
                  borderRadius: 8,
                }}
              >
                + Tambah Jadwal {DAY_LABEL[selectedDay]}
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {daySchedules.map((item) => {
                const isConflict = conflicts.some(
                  (c) =>
                    (c.scheduleA.id === item.id || c.scheduleB.id === item.id) &&
                    c.day === selectedDay
                );

                return (
                  <div
                    key={item.id}
                    style={{
                      background: "#FFFFFF",
                      borderRadius: 12,
                      border: isConflict ? "1.5px solid #FECACA" : "1px solid #E5E7EB",
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 20,
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                    }}
                  >
                    {/* Time block */}
                    <div style={{ textAlign: "center", minWidth: 90 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                        {item.startTime}
                      </div>
                      <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                        s/d {item.endTime}
                      </div>
                    </div>

                    {/* Separator Accent */}
                    <div
                      style={{
                        width: 4,
                        height: 52,
                        borderRadius: 2,
                        background: CATEGORY_COLOR[item.category],
                        flexShrink: 0,
                      }}
                    />

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: 0.4,
                            padding: "2px 8px",
                            borderRadius: 20,
                            background: CATEGORY_BG[item.category],
                            color: CATEGORY_COLOR[item.category],
                          }}
                        >
                          {item.category}
                        </span>

                        {item.priority === "wajib" && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#DC2626",
                              background: "#FEE2E2",
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            Prioritas Wajib
                          </span>
                        )}

                        {item.isRoutine && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: "#4B5563",
                              background: "#F3F4F6",
                              padding: "2px 6px",
                              borderRadius: 4,
                            }}
                          >
                            Rutin Mingguan
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
                        {item.name}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          color: "#6B7280",
                          marginTop: 4,
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          flexWrap: "wrap",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {item.location}
                        </span>

                        {item.lecturer && (
                          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <circle cx="12" cy="7" r="4" />
                              <path d="M5.5 21a6.5 6.5 0 0113 0" />
                            </svg>
                            {item.lecturer}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions & Status */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {isConflict && (
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#DC2626",
                            background: "#FEE2E2",
                            padding: "6px 12px",
                            borderRadius: 20,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                        >
                          <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                          </svg>
                          Bentrok Terdeteksi
                        </span>
                      )}

                      <button
                        onClick={() => {
                          if (confirm(`Hapus jadwal "${item.name}"?`)) {
                            deleteSchedule(item.id);
                          }
                        }}
                        style={{
                          background: "#F9FAFB",
                          border: "1px solid #E5E7EB",
                          borderRadius: 8,
                          padding: "8px 12px",
                          color: "#6B7280",
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#DC2626";
                          e.currentTarget.style.borderColor = "#FCA5A5";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#6B7280";
                          e.currentTarget.style.borderColor = "#E5E7EB";
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
