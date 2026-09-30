"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  PlusCircle,
  ChevronRight,
  ShieldCheck,
  Radar,
  Lightbulb,
  Sparkles,
  School,
  Users,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import ConflictBanner from "@/components/schedule/ConflictBanner";
import ScheduleCard from "@/components/schedule/ScheduleCard";
import CategoryChip from "@/components/ui/CategoryChip";
import SectionHeader from "@/components/ui/SectionHeader";
import EditScheduleModal from "@/components/EditScheduleModal";
import { Schedule, Conflict, ConflictStats, UserProfile } from "@/types/schedule";

// Map Javascript getDay (0 = Sun, 1 = Mon, ...) to DB lowercase day string
const DAY_MAP = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
const DAY_NAMES_ID: Record<string, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [conflictStats, setConflictStats] = useState<ConflictStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("semua");

  // Edit modal state
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Determine today's day in Indonesian
  const todayDayKey = useMemo(() => {
    const todayIndex = new Date().getDay();
    return DAY_MAP[todayIndex];
  }, []);

  const todayFormattedDate = useMemo(() => {
    const now = new Date();
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(now);
  }, []);

  // Fetch real data from all 3 backend endpoints
  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Fetch User Profile
      const meRes = await fetch("/api/auth/me", { cache: "no-store" });
      if (meRes.status === 401) {
        router.push("/login");
        return;
      }
      if (!meRes.ok) {
        throw new Error("Gagal mengambil data user");
      }
      const meData = await meRes.json();
      setUser(meData.user);

      // 2. Fetch All Schedules for this User
      const schedRes = await fetch("/api/schedules", { cache: "no-store" });
      if (schedRes.ok) {
        const schedData = await schedRes.json();
        setSchedules(schedData.schedules || []);
      }

      // 3. Fetch Conflicts
      const confRes = await fetch("/api/conflicts", { cache: "no-store" });
      if (confRes.ok) {
        const confData = await confRes.json();
        setConflicts(confData.conflicts || []);
        setConflictStats(confData.stats || null);
      }
    } catch (err: any) {
      console.error("Dashboard Load Error:", err);
      setError(err?.message || "Terjadi kesalahan saat memuat data.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete schedule
  async function handleDelete(scheduleId: string, name: string) {
    if (!confirm(`Hapus jadwal "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, { method: "DELETE" });
      if (res.ok) {
        await loadDashboardData();
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
    await loadDashboardData();
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Set of schedule IDs that are currently in an unresolved conflict
  const collidingScheduleMap = useMemo(() => {
    const map = new Map<string, string>(); // scheduleId -> conflictId
    conflicts
      .filter((c) => c.status === "unresolved")
      .forEach((c) => {
        if (c.scheduleAId) map.set(c.scheduleAId, c.id);
        if (c.scheduleBId) map.set(c.scheduleBId, c.id);
      });
    return map;
  }, [conflicts]);

  // Schedules for today
  const todaySchedules = useMemo(() => {
    return schedules.filter((s) => s.day?.toLowerCase() === todayDayKey);
  }, [schedules, todayDayKey]);

  // Filtered schedules for today's agenda based on category
  const filteredTodaySchedules = useMemo(() => {
    if (activeCategory === "semua") return todaySchedules;
    if (activeCategory === "conflict") {
      return todaySchedules.filter((s) => collidingScheduleMap.has(s.id));
    }
    return todaySchedules.filter(
      (s) => s.category?.toLowerCase() === activeCategory.toLowerCase()
    );
  }, [todaySchedules, activeCategory, collidingScheduleMap]);

  // Category counts for today
  const categoryCounts = useMemo(() => {
    return {
      semua: todaySchedules.length,
      kuliah: todaySchedules.filter((s) => s.category?.toLowerCase() === "kuliah").length,
      organisasi: todaySchedules.filter((s) => s.category?.toLowerCase() === "organisasi").length,
      conflict: todaySchedules.filter((s) => collidingScheduleMap.has(s.id)).length,
    };
  }, [todaySchedules, collidingScheduleMap]);

  return (
    <div className="flex flex-col gap-6 md:gap-8 w-full">
      {/* ====================================================================
          1. Interactive Top Greeting & Real-Time Radar Ribbon
          ==================================================================== */}
      <section className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="font-sans font-bold text-[22px] md:text-[26px] text-on-surface tracking-tight">
                Halo, {user?.name || "Mahasiswa"}!
              </h1>
              <span className="text-xl md:text-2xl animate-bounce" role="img" aria-label="Melambaikan tangan">
                👋
              </span>
            </div>
            <p className="font-sans text-[13px] md:text-[14px] text-secondary mt-0.5">
              Semester {user?.semester || 1} • {user?.major || "Teknik Informatika"}
            </p>
          </div>

          {/* Date Badge */}
          <div className="bg-surface-container-high px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-sm shrink-0">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span className="font-mono text-[12px] font-semibold text-on-surface">
              {todayFormattedDate}
            </span>
          </div>
        </div>

        {/* Real-time Radar Pulse Ribbon */}
        <div className="bg-surface-container-lowest px-4 py-2.5 rounded-2xl flex items-center justify-between border border-surface-variant/70 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
            <span className="font-sans text-[12px] md:text-[13px] text-on-surface font-medium">
              Radar Aktif • Deteksi Real-Time Otomatis
            </span>
          </div>
          <button
            onClick={loadDashboardData}
            title="Muat ulang sinkronisasi"
            className="flex items-center gap-1 font-mono text-[11px] md:text-[12px] text-primary font-bold hover:underline"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Sinkron Terakhir: Baru Saja</span>
          </button>
        </div>
      </section>

      {/* ====================================================================
          2. Mobile Collision Warning (Directly after Greeting on small screens)
          ==================================================================== */}
      <div className="block lg:hidden">
        <ConflictBanner
          conflicts={conflicts}
          totalSchedulesCount={schedules.length}
        />
      </div>

      {/* ====================================================================
          3. Responsive Layout: 3-Column Grid on Desktop (2 Left, 1 Right)
          ==================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        {/* ==================================================================
            LEFT COLUMN (2 SPANS): Quick Add CTA, Category Filter, Today's Agendas
            ================================================================== */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Big Primary Action Button (+ Tambah Jadwal Baru) */}
          <Link
            href="/schedule/new"
            id="quickAddBtn"
            className="w-full bg-primary hover:bg-primary-container active:scale-[0.98] transition-all p-4 md:p-5 rounded-2xl flex items-center justify-between text-left text-on-primary shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-on-primary/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <PlusCircle className="w-7 h-7 text-on-primary stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-bold text-[16px] md:text-[17px] text-on-primary">
                  + Tambah Jadwal Baru
                </span>
                <span className="font-sans text-[12px] md:text-[13px] text-on-primary-container/90">
                  Input kuliah, rapat organisasi, atau agenda mandiri
                </span>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-on-primary opacity-80 group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Section Header: Agenda Hari Ini */}
          <div className="flex flex-col gap-3">
            <SectionHeader
              title={`Agenda ${DAY_NAMES_ID[todayDayKey] || "Hari Ini"}`}
              subtitle={`${todaySchedules.length} kegiatan terjadwal untuk hari ini`}
              badge={
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-mono text-[11px] font-semibold">
                  {DAY_NAMES_ID[todayDayKey]}
                </span>
              }
            />

            {/* Category Filter Pills (Horizontal Scrollable) */}
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
          </div>

          {/* Schedule List / Cards */}
          <div className="flex flex-col gap-3.5" id="conflict-section">
            {loading ? (
              // Loading Skeleton Cards
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl bg-surface-container-low animate-pulse border border-surface-variant/40"
                />
              ))
            ) : filteredTodaySchedules.length === 0 ? (
              // Empty State for Today
              <div className="bg-surface-container-lowest rounded-2xl p-8 border border-surface-variant/70 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-low text-primary flex items-center justify-center">
                  <CalendarIcon className="w-7 h-7" />
                </div>
                <div className="flex flex-col max-w-sm">
                  <h3 className="font-sans font-bold text-[16px] text-on-surface">
                    {todaySchedules.length === 0
                      ? `Tidak ada agenda pada hari ${DAY_NAMES_ID[todayDayKey]}`
                      : `Tidak ada agenda dengan filter "${activeCategory}"`}
                  </h3>
                  <p className="font-sans text-[13px] text-secondary mt-1">
                    {todaySchedules.length === 0
                      ? "Kamu bebas hari ini! Tambahkan agenda baru untuk mulai mendeteksi bentrokan waktu secara otomatis."
                      : "Coba ubah pilihan filter kategori di atas untuk melihat agenda lainnya."}
                  </p>
                </div>
                {todaySchedules.length === 0 && (
                  <Link
                    href="/schedule/new"
                    className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary text-[13px] font-semibold hover:bg-primary-container transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambah Jadwal Sekarang</span>
                  </Link>
                )}
              </div>
            ) : (
              // Schedule Cards Rendered
              filteredTodaySchedules.map((schedule) => (
                <ScheduleCard
                  key={schedule.id}
                  schedule={schedule}
                  isColliding={collidingScheduleMap.has(schedule.id)}
                  conflictId={collidingScheduleMap.get(schedule.id)}
                  onEdit={() => handleEdit(schedule)}
                  onDelete={() => handleDelete(schedule.id, schedule.name)}
                />
              ))
            )}
          </div>
        </div>

        {/* ==================================================================
            RIGHT COLUMN (1 SPAN): Sticky Radar Summary, Health Card, & Tips
            ================================================================== */}
        <div className="flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Desktop Conflict Warning Banner */}
          <div className="hidden lg:block">
            <ConflictBanner
              conflicts={conflicts}
              totalSchedulesCount={schedules.length}
            />
          </div>

          {/* Radar Health Score Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant/70 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Radar className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-bold text-[15px] text-on-surface">
                  Skor Kesehatan Radar
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {conflictStats?.healthScore !== undefined ? `${conflictStats.healthScore}%` : "100%"}
              </span>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="bg-surface-container-low p-3 rounded-xl flex flex-col">
                <span className="font-sans font-bold text-[18px] text-on-surface tabular-nums">
                  {schedules.length}
                </span>
                <span className="font-mono text-[11px] text-secondary mt-0.5">
                  Total Jadwal
                </span>
              </div>
              <div className="bg-surface-container-low p-3 rounded-xl flex flex-col">
                <span className="font-sans font-bold text-[18px] text-emerald-600 tabular-nums">
                  {conflictStats?.resolved || 0}
                </span>
                <span className="font-mono text-[11px] text-secondary mt-0.5">
                  Konflik Selesai
                </span>
              </div>
            </div>
          </div>

          {/* Tips Mahasiswa Card */}
          <div className="bg-gradient-to-br from-surface-container-low to-surface-container-lowest rounded-2xl p-5 border border-surface-variant/70 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Tips Radar Mahasiswa</span>
            </div>
            <p className="font-sans text-[13px] text-secondary leading-relaxed">
              Jeda minimal <strong>15–30 menit</strong> antar kelas sangat dianjurkan untuk mobilisasi perpindahan gedung lab kuliah dan istirahat sebelum rapat organisasi.
            </p>
            <div className="pt-2 flex items-center justify-between text-[12px] text-primary font-semibold">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Deteksi Otomatis FRS
              </span>
              <Link href="/calendar" className="hover:underline">
                Lihat Kalender →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={isEditModalOpen}
        schedule={editingSchedule}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSchedule(null);
        }}
        onSaved={handleEditSaved}
      />
    </div>
  );
}
