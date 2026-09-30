"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RefreshCw, AlertTriangle, Plus } from "lucide-react";

// Types
interface Schedule {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  category: string;
  location?: string | null;
}

interface ConflictItem {
  id: string;
  day: string;
  scheduleA: Schedule;
  scheduleB: Schedule;
  status: string;
}

const DAYS = ["senin", "selasa", "rabu", "kamis", "jumat", "sabtu", "minggu"];
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
const CATEGORY_BORDER: Record<string, string> = {
  kuliah: "#BFDBFE",
  organisasi: "#DDD6FE",
  lainnya: "#A7F3D0",
};

// Hours from 07:00 to 22:00
const START_HOUR = 7;
const END_HOUR = 22;
const HOURS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);
const TOTAL_MINUTES = (END_HOUR - START_HOUR) * 60;
const GRID_HEIGHT = 750;

function pct(time: string) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m - START_HOUR * 60;
  return (total / TOTAL_MINUTES) * GRID_HEIGHT;
}

function blockHeight(start: string, end: string) {
  const [hs, ms] = start.split(":").map(Number);
  const [he, me] = end.split(":").map(Number);
  const diff = he * 60 + me - (hs * 60 + ms);
  return Math.max((diff / TOTAL_MINUTES) * GRID_HEIGHT, 36);
}

// Determine today's day key
const TODAY_IDX = new Date().getDay(); // 0=Sun
const DAY_MAP = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
const TODAY_KEY = DAY_MAP[TODAY_IDX];

export default function WeeklyPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [conflicts, setConflicts] = useState<ConflictItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [schRes, cfRes] = await Promise.all([
          fetch("/api/schedules"),
          fetch("/api/conflicts"),
        ]);

        if (schRes.status === 401 || cfRes.status === 401) {
          router.replace("/login");
          return;
        }
        if (!schRes.ok) throw new Error("Gagal memuat jadwal");
        if (!cfRes.ok) throw new Error("Gagal memuat konflik");

        const schData = await schRes.json();
        const cfData = await cfRes.json();

        setSchedules(schData.schedules || []);
        setConflicts(cfData.conflicts || []);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const conflictingIds = useMemo(() => {
    const ids = new Set<string>();
    conflicts
      .filter((c) => c.status === "unresolved")
      .forEach((c) => {
        if (c.scheduleA?.id) ids.add(c.scheduleA.id);
        if (c.scheduleB?.id) ids.add(c.scheduleB.id);
      });
    return ids;
  }, [conflicts]);

  const unresolvedCount = conflicts.filter((c) => c.status === "unresolved").length;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <RefreshCw size={24} style={{ color: "#1A56DB", animation: "spin 1s linear infinite" }} />
        <span style={{ marginLeft: 10, color: "#6B7280", fontSize: 14 }}>Memuat peta waktu...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <AlertTriangle size={40} color="#EF4444" style={{ margin: "0 auto 12px" }} />
        <p style={{ color: "#EF4444", fontWeight: 600 }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: 16, padding: "8px 20px", background: "#1A56DB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Top Controls & Legend Header */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "20px 24px",
          border: "1px solid #E5E7EB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}
      >
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
            Peta Waktu Mingguan
          </h2>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
            Semua agenda 7 hari ditata secara proporsional berdasarkan waktu mulai dan selesai
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#1A56DB" }} />
            <span style={{ fontSize: 12, color: "#4B5563", fontWeight: 600 }}>Kuliah</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#7C3AED" }} />
            <span style={{ fontSize: 12, color: "#4B5563", fontWeight: 600 }}>Organisasi</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: "#059669" }} />
            <span style={{ fontSize: 12, color: "#4B5563", fontWeight: 600 }}>Lainnya</span>
          </div>
          {unresolvedCount > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: "#FEE2E2",
                  border: "1.5px solid #EF4444",
                }}
              />
              <span style={{ fontSize: 12, color: "#DC2626", fontWeight: 700 }}>
                Bentrokan ({unresolvedCount})
              </span>
            </div>
          )}

          <Link
            href="/add"
            style={{
              textDecoration: "none",
              background: "#1A56DB",
              color: "#FFFFFF",
              padding: "7px 16px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Plus size={14} />
            Tambah Jadwal
          </Link>
        </div>
      </div>

      {/* Main Weekly Desktop Grid */}
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E5E7EB",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          overflowX: "auto",
        }}
      >
        <div style={{ minWidth: "900px" }}>
          {/* Day Headers Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "70px repeat(7, 1fr)",
              borderBottom: "1.5px solid #E5E7EB",
              background: "#F9FAFB",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: "14px 8px",
                textAlign: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#9CA3AF",
                textTransform: "uppercase",
                borderRight: "1px solid #E5E7EB",
              }}
            >
              WIB
            </div>
            {DAYS.map((day) => {
              const daySchedules = schedules.filter((s) => s.day === day);
              const dayConflicts = conflicts.filter(
                (c) => c.status === "unresolved" && (c.day === day || c.scheduleA?.day === day || c.scheduleB?.day === day)
              );
              const isToday = day === TODAY_KEY;

              return (
                <div
                  key={day}
                  style={{
                    padding: "12px 10px",
                    textAlign: "center",
                    borderRight: "1px solid #E5E7EB",
                    background: isToday ? "#EBF0FD" : "transparent",
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: isToday ? "#1A56DB" : "#111827",
                    }}
                  >
                    {DAY_LABEL[day]}
                    {isToday && (
                      <span
                        style={{
                          marginLeft: 4,
                          fontSize: 9,
                          background: "#1A56DB",
                          color: "#fff",
                          borderRadius: 4,
                          padding: "1px 5px",
                          fontWeight: 800,
                          verticalAlign: "middle",
                        }}
                      >
                        Hari Ini
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                    {daySchedules.length} kegiatan
                  </div>
                  {dayConflicts.length > 0 && (
                    <div
                      style={{
                        marginTop: 4,
                        display: "inline-block",
                        fontSize: 10,
                        fontWeight: 700,
                        background: "#FEE2E2",
                        color: "#DC2626",
                        padding: "1px 6px",
                        borderRadius: 10,
                      }}
                    >
                      {dayConflicts.length} konflik
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Timeline Grid Body */}
          <div
            style={{
              position: "relative",
              height: `${GRID_HEIGHT}px`,
              display: "grid",
              gridTemplateColumns: "70px repeat(7, 1fr)",
            }}
          >
            {/* Time labels column */}
            <div
              style={{
                borderRight: "1px solid #E5E7EB",
                background: "#F9FAFB",
                position: "relative",
              }}
            >
              {HOURS.slice(0, -1).map((h) => {
                const top = ((h - START_HOUR) / (END_HOUR - START_HOUR)) * GRID_HEIGHT;
                return (
                  <div
                    key={h}
                    style={{
                      position: "absolute",
                      top: `${top}px`,
                      width: "100%",
                      textAlign: "center",
                      fontSize: 11,
                      fontWeight: 600,
                      color: "#9CA3AF",
                      transform: "translateY(-50%)",
                    }}
                  >
                    {String(h).padStart(2, "0")}:00
                  </div>
                );
              })}
            </div>

            {/* Horizontal Grid lines */}
            {HOURS.slice(0, -1).map((h) => {
              const top = ((h - START_HOUR) / (END_HOUR - START_HOUR)) * GRID_HEIGHT;
              return (
                <div
                  key={`line-${h}`}
                  style={{
                    position: "absolute",
                    top: `${top}px`,
                    left: 70,
                    right: 0,
                    height: 1,
                    background: "#F3F4F6",
                    pointerEvents: "none",
                  }}
                />
              );
            })}

            {/* 7 Day Columns */}
            {DAYS.map((day) => {
              const daySchedules = schedules.filter((s) => s.day === day);
              const isToday = day === TODAY_KEY;

              return (
                <div
                  key={day}
                  style={{
                    position: "relative",
                    borderRight: "1px solid #E5E7EB",
                    background: isToday ? "rgba(235, 240, 253, 0.25)" : "transparent",
                  }}
                >
                  {daySchedules.length === 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        fontSize: 11,
                        color: "#D1D5DB",
                        textAlign: "center",
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    >
                      Kosong
                    </div>
                  )}
                  {daySchedules.map((item) => {
                    const top = pct(item.startTime);
                    const height = blockHeight(item.startTime, item.endTime);
                    const hasConflict = conflictingIds.has(item.id);
                    const catColor = CATEGORY_COLOR[item.category] || "#6B7280";
                    const catBg = CATEGORY_BG[item.category] || "#F3F4F6";
                    const catBorder = CATEGORY_BORDER[item.category] || "#E5E7EB";

                    return (
                      <div
                        key={item.id}
                        title={`${item.name} (${item.startTime} - ${item.endTime})${item.location ? ` @ ${item.location}` : ""}`}
                        style={{
                          position: "absolute",
                          top: `${top}px`,
                          left: "4px",
                          right: "4px",
                          height: `${height}px`,
                          borderRadius: 8,
                          padding: "6px 8px",
                          overflow: "hidden",
                          boxSizing: "border-box",
                          background: hasConflict ? "#FFF1F2" : catBg,
                          border: hasConflict ? "2px solid #EF4444" : `1px solid ${catBorder}`,
                          borderLeft: hasConflict ? "4px solid #EF4444" : `4px solid ${catColor}`,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          boxShadow: hasConflict
                            ? "0 2px 8px rgba(239, 68, 68, 0.15)"
                            : "0 1px 3px rgba(0,0,0,0.03)",
                          zIndex: hasConflict ? 5 : 2,
                          transition: "transform 0.15s ease",
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: hasConflict ? "#DC2626" : catColor,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <span>
                              {item.startTime}–{item.endTime}
                            </span>
                            {hasConflict && (
                              <span
                                style={{
                                  background: "#EF4444",
                                  color: "#FFFFFF",
                                  borderRadius: 4,
                                  padding: "1px 4px",
                                  fontSize: 8,
                                  fontWeight: 800,
                                }}
                              >
                                KONFLIK
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: hasConflict ? "#991B1B" : "#111827",
                              marginTop: 2,
                              lineHeight: 1.25,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {item.name}
                          </div>
                        </div>

                        {item.location && (
                          <div
                            style={{
                              fontSize: 9,
                              color: "#6B7280",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              marginTop: 2,
                            }}
                          >
                            {item.location}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {schedules.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 24px",
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
          }}
        >
          <p style={{ color: "#9CA3AF", fontSize: 14 }}>
            Belum ada jadwal yang ditambahkan.
          </p>
          <Link
            href="/add"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              marginTop: 12,
              padding: "8px 20px",
              background: "#1A56DB",
              color: "#fff",
              borderRadius: 8,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <Plus size={16} />
            Tambah Jadwal Pertama
          </Link>
        </div>
      )}
    </div>
  );
}
