"use client";

import React, { useState, useMemo } from "react";
import { ScheduleItem } from "@/types/schedule";

interface ScheduleListProps {
  schedules: ScheduleItem[];
  onEditSchedule: (schedule: ScheduleItem) => void;
}

const DAYS = ["Semua", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const STATUS_CONFIG: Record<ScheduleItem["status"], { label: string; color: string; bg: string; border: string }> = {
  "Sedang Berlangsung": { label: "Berlangsung", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0" },
  "Akan Datang":        { label: "Akan Datang", color: "#4f46e5", bg: "#eef2ff", border: "#c7d2fe" },
  "Selesai":            { label: "Selesai",      color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
  "Ditiadakan":         { label: "Ditiadakan",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const TYPE_CONFIG: Record<ScheduleItem["type"], { label: string; color: string; bg: string; border: string }> = {
  Teori:     { label: "Teori",     color: "#7c3aed", bg: "#faf5ff", border: "#e9d5ff" },
  Praktikum: { label: "Praktikum", color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" },
  Seminar:   { label: "Seminar",   color: "#b45309", bg: "#fffbeb", border: "#fde68a" },
};

export default function ScheduleList({ schedules, onEditSchedule }: ScheduleListProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredSchedules = useMemo(() => {
    return schedules.filter((item) => {
      const matchDay = selectedDay === "Semua" || item.day === selectedDay;
      const q = searchQuery.toLowerCase();
      const matchSearch =
        !q ||
        item.courseName.toLowerCase().includes(q) ||
        item.lecturer.toLowerCase().includes(q) ||
        item.courseCode.toLowerCase().includes(q) ||
        item.room.toLowerCase().includes(q);
      return matchDay && matchSearch;
    });
  }, [schedules, selectedDay, searchQuery]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Filter + Search Bar */}
      <div
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-xl"
        style={{ background: "#ffffff", border: "1px solid #e8eaf0", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        {/* Day tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none flex-shrink-0">
          {DAYS.map((day) => {
            const isActive = selectedDay === day;
            const count = day === "Semua" ? schedules.length : schedules.filter((s) => s.day === day).length;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                style={
                  isActive
                    ? { background: "#4f46e5", color: "#ffffff" }
                    : { background: "transparent", color: "#6b7280" }
                }
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "#f1f3f8"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                {day}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={
                    isActive
                      ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                      : { background: "#f1f3f8", color: "#9ca3af" }
                  }
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
            style={{ color: "#9ca3af" }}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari mata kuliah, dosen, ruangan..."
            className="pl-9 pr-9 py-2 text-xs sm:text-sm rounded-lg outline-none w-full sm:w-64 transition-all"
            style={{ background: "#f8f9fc", border: "1px solid #e8eaf0", color: "#111827" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#4f46e5")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#e8eaf0")}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs cursor-pointer"
              style={{ color: "#9ca3af" }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {filteredSchedules.length === 0 ? (
        <div
          className="rounded-xl p-14 text-center flex flex-col items-center gap-3"
          style={{ background: "#ffffff", border: "1px dashed #d0d4e0" }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#f1f3f8" }}>
            <svg className="w-6 h-6" style={{ color: "#9ca3af" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h4 className="font-semibold text-sm" style={{ color: "#374151" }}>Tidak ada jadwal ditemukan</h4>
          <p className="text-xs" style={{ color: "#9ca3af" }}>Coba ubah filter hari atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {filteredSchedules.map((item, idx) => {
            const status = STATUS_CONFIG[item.status];
            const type = TYPE_CONFIG[item.type];
            const isOngoing = item.status === "Sedang Berlangsung";

            return (
              <div
                key={item.id}
                className="fade-slide-up rounded-xl p-5 flex flex-col transition-all duration-200"
                style={{
                  animationDelay: `${idx * 0.04}s`,
                  background: "#ffffff",
                  border: isOngoing ? "1px solid #bbf7d0" : "1px solid #e8eaf0",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.09)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Top row: code + type + status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded"
                      style={{ background: "#f1f3f8", color: "#6b7280", border: "1px solid #e8eaf0" }}
                    >
                      {item.courseCode}
                    </span>
                    <span
                      className="text-[11px] font-medium px-2 py-0.5 rounded"
                      style={{ background: type.bg, color: type.color, border: `1px solid ${type.border}` }}
                    >
                      {type.label} · {item.sks} SKS
                    </span>
                  </div>

                  <span
                    className="flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isOngoing ? "pulse-dot" : ""}`}
                      style={{ background: status.color }}
                    />
                    {status.label}
                  </span>
                </div>

                {/* Course name */}
                <h3 className="text-base font-bold mb-4 leading-snug" style={{ color: "#111827" }}>
                  {item.courseName}
                </h3>

                {/* Detail rows */}
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: "#eef2ff" }}>
                      <svg className="w-3.5 h-3.5" style={{ color: "#4f46e5" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-medium" style={{ color: "#374151" }}>
                      {item.day}, {item.startTime} – {item.endTime} WIB
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: "#f0fdf4" }}>
                      <svg className="w-3.5 h-3.5" style={{ color: "#059669" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm" style={{ color: "#6b7280" }}>
                      {item.room}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0" style={{ background: "#faf5ff" }}>
                      <svg className="w-3.5 h-3.5" style={{ color: "#7c3aed" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm truncate" style={{ color: "#6b7280" }}>
                      {item.lecturer}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {item.notes && (
                  <div
                    className="mb-4 px-3 py-2 rounded-lg text-[11px] sm:text-xs leading-relaxed flex items-start gap-2"
                    style={{ background: "#f8f9fc", border: "1px solid #e8eaf0", color: "#6b7280" }}
                  >
                    <span className="font-bold shrink-0" style={{ color: "#4f46e5" }}>Info</span>
                    <p className="line-clamp-2">{item.notes}</p>
                  </div>
                )}

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-3 mt-auto"
                  style={{ borderTop: "1px solid #f1f3f8" }}
                >
                  <span className="font-mono text-[10px]" style={{ color: "#d1d5db" }}>
                    #{item.id}
                  </span>
                  <button
                    type="button"
                    onClick={() => onEditSchedule(item)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                    style={{ background: "#eef2ff", color: "#4f46e5", border: "1px solid #c7d2fe" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#4f46e5";
                      e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#eef2ff";
                      e.currentTarget.style.color = "#4f46e5";
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Jadwal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
