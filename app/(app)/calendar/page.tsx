"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  School,
  Users,
  AlertTriangle,
  Plus,
  Radar,
  Calendar as CalendarIcon,
  Flame,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import CategoryChip from "@/components/ui/CategoryChip";
import EditScheduleModal from "@/components/EditScheduleModal";
import { Schedule, Conflict, ConflictStats } from "@/types/schedule";

// 7 Days of the week in Indonesian
const DAYS_ORDER = [
  { key: "senin", short: "Sen", full: "Senin" },
  { key: "selasa", short: "Sel", full: "Selasa" },
  { key: "rabu", short: "Rab", full: "Rabu" },
  { key: "kamis", short: "Kam", full: "Kamis" },
  { key: "jumat", short: "Jum", full: "Jumat" },
  { key: "sabtu", short: "Sab", full: "Sabtu" },
  { key: "minggu", short: "Min", full: "Minggu" },
];

function timeToMinutes(t: string): number {
  if (!t || !t.includes(":")) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function CalendarPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [stats, setStats] = useState<ConflictStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit modal state
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Filter & Day selections
  const [selectedDay, setSelectedDay] = useState("kamis");
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [schedRes, confRes] = await Promise.all([
        fetch("/api/schedules", { cache: "no-store" }),
        fetch("/api/conflicts", { cache: "no-store" }),
      ]);

      if (schedRes.ok) {
        const schedData = await schedRes.json();
        setSchedules(schedData.schedules || []);
      }
      if (confRes.ok) {
        const confData = await confRes.json();
        setConflicts(confData.conflicts || []);
        setStats(confData.stats || null);
      }
    } catch (err) {
      console.error("Calendar Load Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle delete schedule
  async function handleDelete(scheduleId: string, name: string) {
    if (!confirm(`Hapus jadwal "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, { method: "DELETE" });
      if (res.ok) {
        await loadData(); // refresh data incl. conflicts
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menghapus jadwal");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    }
  }

  // Handle edit modal open
  function handleEdit(schedule: Schedule) {
    setEditingSchedule(schedule);
    setIsEditModalOpen(true);
  }

  // Handle successful save from edit modal
  async function handleEditSaved() {
    setIsEditModalOpen(false);
    setEditingSchedule(null);
    await loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  // Map of clashing schedule ID -> conflict ID
  const clashingScheduleMap = useMemo(() => {
    const map = new Map<string, string>();
    conflicts
      .filter((c) => c.status === "unresolved")
      .forEach((c) => {
        if (c.scheduleAId) map.set(c.scheduleAId, c.id);
        if (c.scheduleBId) map.set(c.scheduleBId, c.id);
      });
    return map;
  }, [conflicts]);

  // Set of days that have unresolved conflicts
  const daysWithConflicts = useMemo(() => {
    const set = new Set<string>();
    conflicts
      .filter((c) => c.status === "unresolved")
      .forEach((c) => {
        if (c.day) set.add(c.day.toLowerCase());
      });
    return set;
  }, [conflicts]);

  // Filter schedules by selected day
  const daySchedules = useMemo(() => {
    return schedules
      .filter((s) => s.day?.toLowerCase() === selectedDay.toLowerCase())
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  }, [schedules, selectedDay]);

  // Conflicts on the selected day
  const dayConflicts = useMemo(() => {
    return conflicts.filter(
      (c) => c.day?.toLowerCase() === selectedDay.toLowerCase() && c.status === "unresolved"
    );
  }, [conflicts, selectedDay]);

  // Filtered by category
  const filteredDaySchedules = useMemo(() => {
    if (activeCategory === "semua") return daySchedules;
    if (activeCategory === "conflict") {
      return daySchedules.filter((s) => clashingScheduleMap.has(s.id));
    }
    return daySchedules.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [daySchedules, activeCategory, clashingScheduleMap]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return {
      semua: daySchedules.length,
      kuliah: daySchedules.filter((s) => s.category?.toLowerCase() === "kuliah").length,
      organisasi: daySchedules.filter((s) => s.category?.toLowerCase() === "organisasi").length,
      conflict: daySchedules.filter((s) => clashingScheduleMap.has(s.id)).length,
    };
  }, [daySchedules, clashingScheduleMap]);

  return (
    <>
    <div className="flex flex-col gap-6 w-full">
      {/* ====================================================================
          1. Month Selector & Sub-Header
          ==================================================================== */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="font-sans font-bold text-[20px] md:text-[24px] text-on-surface tracking-tight">
            Kalender & Agenda
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[11px] font-semibold">
            Semester Aktif
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/schedule/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary text-[13px] font-semibold hover:bg-primary-container transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Agenda</span>
          </Link>
        </div>
      </div>

      {/* ====================================================================
          2. Horizontal Date Strip (Senin - Minggu)
          ==================================================================== */}
      <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-variant/80 shadow-sm flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        {DAYS_ORDER.map((day) => {
          const isSelected = selectedDay.toLowerCase() === day.key;
          const hasConflict = daysWithConflicts.has(day.key);
          const countOnDay = schedules.filter((s) => s.day?.toLowerCase() === day.key).length;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDay(day.key)}
              aria-pressed={isSelected}
              className={`flex-1 min-w-[50px] py-2.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "bg-primary text-on-primary shadow-md scale-105"
                  : "bg-surface-container-low hover:bg-surface-container text-on-surface"
              }`}
            >
              <span className={`font-mono text-[12px] ${isSelected ? "text-primary-fixed" : "text-secondary"}`}>
                {day.short}
              </span>
              <span className="font-sans font-bold text-[15px] mt-0.5">
                {countOnDay}
              </span>
              {/* Conflict indicator dots */}
              <div className="h-1.5 flex items-center gap-0.5 mt-1">
                {hasConflict && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-tertiary-fixed animate-pulse" : "bg-tertiary animate-pulse"
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* ====================================================================
          3. Category Filter Chips
          ==================================================================== */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <CategoryChip
          label="Semua"
          count={categoryCounts.semua}
          active={activeCategory === "semua"}
          onClick={() => setActiveCategory("semua")}
        />
        <CategoryChip
          label="Kuliah"
          icon={School}
          variant="kuliah"
          count={categoryCounts.kuliah}
          active={activeCategory === "kuliah"}
          onClick={() => setActiveCategory("kuliah")}
        />
        <CategoryChip
          label="Organisasi"
          icon={Users}
          variant="organisasi"
          count={categoryCounts.organisasi}
          active={activeCategory === "organisasi"}
          onClick={() => setActiveCategory("organisasi")}
        />
        {categoryCounts.conflict > 0 && (
          <CategoryChip
            label="Bentrok"
            icon={AlertTriangle}
            variant="conflict"
            count={categoryCounts.conflict}
            active={activeCategory === "conflict"}
            onClick={() => setActiveCategory("conflict")}
          />
        )}
      </div>

      {/* ====================================================================
          4. Desktop 2-Column Split: Schedules on Left, Conflict Radar on Right
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Schedules for Selected Day */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          {/* Day header banner */}
          <div className="flex items-center justify-between">
            <h2 className="font-sans font-bold text-[18px] text-on-surface">
              Jadwal Hari {DAYS_ORDER.find((d) => d.key === selectedDay)?.full}
            </h2>
            <span className="font-mono text-[13px] text-secondary">
              {filteredDaySchedules.length} Agenda Terdaftar
            </span>
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-2xl bg-surface-container-low animate-pulse border border-surface-variant/40"
              />
            ))
          ) : filteredDaySchedules.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant/70 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-surface-container-low text-primary flex items-center justify-center">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-sans font-bold text-[15px] text-on-surface">
                  Tidak ada agenda pada hari ini
                </h3>
                <p className="font-sans text-[13px] text-secondary mt-0.5">
                  Tambahkan jadwal kuliah atau kegiatan organisasi untuk hari ini.
                </p>
              </div>
              <Link
                href="/schedule/new"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary text-[13px] font-semibold"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Jadwal</span>
              </Link>
            </div>
          ) : (
            filteredDaySchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                isColliding={clashingScheduleMap.has(schedule.id)}
                conflictId={clashingScheduleMap.get(schedule.id)}
                onEdit={() => handleEdit(schedule)}
                onDelete={() => handleDelete(schedule.id, schedule.name)}
              />
            ))
          )}
        </div>

        {/* Right Column: Conflict Radar & Overlap Summary for Selected Day */}
        <div className="lg:col-span-4 flex flex-col gap-5 lg:sticky lg:top-24">
          {dayConflicts.length > 0 ? (
            <div className="bg-tertiary-fixed rounded-2xl p-5 border border-tertiary-container/30 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-tertiary-container text-on-tertiary flex items-center justify-center shadow-sm">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h3 className="font-sans font-bold text-[15px] text-on-tertiary-fixed">
                    {dayConflicts.length} Konflik Terdeteksi
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-tertiary text-on-tertiary text-[11px] font-bold">
                  Kritis
                </span>
              </div>

              <p className="font-sans text-[13px] text-on-tertiary-fixed-variant leading-relaxed">
                Terdapat tumpang tindih waktu kegiatan pada hari{" "}
                <strong>{DAYS_ORDER.find((d) => d.key === selectedDay)?.full}</strong>.
              </p>

              {/* Conflict items list */}
              <div className="flex flex-col gap-2.5">
                {dayConflicts.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-surface-container-lowest/90 backdrop-blur-sm border border-tertiary/20 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[12px] font-bold text-tertiary">
                        Irisan {c.overlapStart} – {c.overlapEnd}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-secondary">
                        {c.overlapMinutes} Menit
                      </span>
                    </div>

                    <div className="text-[13px] font-semibold text-on-surface">
                      {c.scheduleA?.name} <span className="text-tertiary">✕</span> {c.scheduleB?.name}
                    </div>

                    <Link
                      href={`/conflict/${c.id}`}
                      className="inline-flex items-center gap-1 text-[12px] font-bold text-tertiary hover:underline mt-1"
                    >
                      <span>Buka Resolusi Konflik</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant/80 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2.5 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-sans font-bold text-[15px] text-on-surface">
                  Hari Ini Aman
                </h3>
              </div>
              <p className="font-sans text-[13px] text-secondary leading-relaxed">
                Tidak ada tabrakan waktu yang terdeteksi pada hari{" "}
                <strong>{DAYS_ORDER.find((d) => d.key === selectedDay)?.full}</strong>. Semua agenda tersusun rapi.
              </p>
            </div>
          )}

          {/* Quick Academic Info Card */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-variant/70 flex flex-col gap-2">
            <span className="font-sans font-bold text-[13px] text-primary flex items-center gap-1.5">
              <Radar className="w-4 h-4" />
              Sinkronisasi Radar Aktif
            </span>
            <p className="font-sans text-[12px] text-secondary leading-relaxed">
              Jadwal yang kamu inputkan otomatis dipindai terhadap jadwal kuliah resmi dan rapat organisasi.
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Edit Schedule Modal */}
    <EditScheduleModal
      isOpen={isEditModalOpen}
      schedule={editingSchedule}
      onClose={() => { setIsEditModalOpen(false); setEditingSchedule(null); }}
      onSaved={handleEditSaved}
    />
    </>
  );
}
