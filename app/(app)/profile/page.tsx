"use client";

import React, { useState } from "react";
import { DUMMY_USER } from "@/data/schedules";
import { useScheduleStore } from "@/store/useScheduleStore";

/* ─── small icon helpers (inline SVG, no extra dep) ─── */
function IconRadar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 6a6 6 0 1 0 6 6" /><path d="M12 10a2 2 0 1 0 2 2" /><line x1="22" y1="2" x2="12" y2="12" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconChevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconSchool() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconCategory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconHelp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function IconTune() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}
function IconAdd() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}
function IconVerified() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );
}

/* ─── Setting row ─── */
function SettingRow({
  icon,
  title,
  subtitle,
  right,
  last = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right: React.ReactNode;
  last?: boolean;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-primary"
            style={{ background: "var(--color-surface-container)" }}
          >
            {icon}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-on-surface truncate">{title}</span>
            {subtitle && (
              <span className="text-xs text-secondary truncate mt-0.5">{subtitle}</span>
            )}
          </div>
        </div>
        <div className="shrink-0 ml-2">{right}</div>
      </div>
      {!last && (
        <div className="h-px mx-4" style={{ background: "var(--color-surface-low)" }} />
      )}
    </>
  );
}

/* ─── Section group wrapper ─── */
function SettingsGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[11px] font-bold tracking-widest uppercase px-1"
        style={{ color: "var(--color-secondary)" }}
      >
        {label}
      </span>
      <div
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          background: "var(--color-surface-lowest)",
          border: "1px solid var(--color-surface-high)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ─── Toggle switch ─── */
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="w-12 h-7 rounded-full relative flex items-center px-1 transition-colors duration-200 shrink-0 cursor-pointer"
      style={{ background: on ? "var(--color-primary)" : "var(--color-outline-variant)" }}
    >
      <span
        className="w-5 h-5 rounded-full shadow-sm transition-transform duration-200"
        style={{
          background: "white",
          transform: on ? "translateX(20px)" : "translateX(0px)",
        }}
      />
    </button>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function ProfilePage() {
  const { schedules, conflicts } = useScheduleStore();
  const [realtimeAlert, setRealtimeAlert] = useState(true);

  /* ── derived stats ── */
  const totalSchedules = schedules.length;
  const unresolvedConflicts = conflicts.length;
  const conflictingIds = new Set(
    conflicts.flatMap((c) => [c.scheduleA.id, c.scheduleB.id])
  );
  const safeCount = Math.max(0, totalSchedules - conflictingIds.size);
  const healthScore =
    totalSchedules === 0 ? 100 : Math.round((safeCount / totalSchedules) * 100);

  /* SVG circle health ring — values out of 100 */
  const dashArray = `${healthScore}, 100`;

  const CUSTOM_CATEGORIES = [
    { label: "Kuliah",    bg: "#e0e7ff", color: "#3730a3" },
    { label: "Organisasi", bg: "#d1fae5", color: "#065f46" },
    { label: "Lainnya",   bg: "#fef3c7", color: "#92400e" },
  ];

  return (
    <div className="flex flex-col gap-5 w-full max-w-lg mx-auto pb-2 animate-fade-slide-up">

      {/* ── Subheader ── */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--color-secondary)" }}>
            Akun Mahasiswa
          </p>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Profil Saya
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label="Pengaturan"
            className="w-10 h-10 rounded-full shrink-0 aspect-square flex items-center justify-center transition-colors active:scale-95 cursor-pointer text-on-surface-variant"
            style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", background: "var(--color-surface-container)" }}
          >
            <IconTune />
          </button>
          <button
            type="button"
            aria-label="Edit Profil"
            className="w-10 h-10 rounded-full shrink-0 aspect-square flex items-center justify-center transition-colors active:scale-95 cursor-pointer"
            style={{ width: "40px", height: "40px", minWidth: "40px", minHeight: "40px", background: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed)" }}
          >
            <IconEdit />
          </button>
        </div>
      </div>

      {/* ── Identity Card ── */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-sm"
        style={{
          background: "var(--color-surface-lowest)",
          border: "1px solid var(--color-surface-high)",
        }}
      >
        {/* decorative blob */}
        <div
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ background: "var(--color-primary-fixed)" }}
        />

        {/* avatar + info */}
        <div className="flex items-start gap-4 relative">
          <div
            className="relative shrink-0 w-16 h-16"
            style={{ width: "64px", height: "64px", minWidth: "64px", minHeight: "64px" }}
          >
            <div
              className="w-16 h-16 min-w-16 min-h-16 rounded-full shrink-0 aspect-square flex items-center justify-center text-2xl font-extrabold shadow-sm"
              style={{
                width: "64px",
                height: "64px",
                minWidth: "64px",
                minHeight: "64px",
                aspectRatio: "1 / 1",
                background: "var(--color-primary-fixed)",
                color: "var(--color-on-primary-fixed-variant)",
              }}
            >
              {DUMMY_USER.name.charAt(0)}
            </div>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 min-w-6 min-h-6 rounded-full shrink-0 aspect-square flex items-center justify-center shadow"
              style={{
                width: "24px",
                height: "24px",
                minWidth: "24px",
                minHeight: "24px",
                aspectRatio: "1 / 1",
                background: "var(--color-primary)",
                color: "var(--color-on-primary)",
              }}
            >
              <IconVerified />
            </div>
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="text-[17px] font-bold leading-tight" style={{ color: "var(--color-on-surface)" }}>
              {DUMMY_USER.name}
            </h2>
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--color-on-surface-variant)" }}>
              S1 {DUMMY_USER.faculty} • {DUMMY_USER.university}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span
                className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md"
                style={{ background: "var(--color-surface-low)", color: "var(--color-secondary)" }}
              >
                NIM {DUMMY_USER.nim}
              </span>
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed-variant)" }}
              >
                Angkatan {DUMMY_USER.angkatan}
              </span>
            </div>
          </div>
        </div>

        {/* status row */}
        <div
          className="flex items-center justify-between rounded-xl px-3 py-2"
          style={{ background: "var(--color-surface-low)" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-xs font-semibold" style={{ color: "var(--color-on-surface)" }}>
              Semester {DUMMY_USER.semester} • Aktif
            </span>
          </div>
          <span
            className="text-[11px] font-bold flex items-center gap-1 cursor-pointer"
            style={{ color: "var(--color-primary)" }}
          >
            SIAKAD
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Radar Health Score ── */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm"
        style={{
          background: "var(--color-surface-lowest)",
          border: "1px solid var(--color-surface-high)",
        }}
      >
        {/* header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-primary"><IconRadar /></span>
            <span className="text-[15px] font-bold" style={{ color: "var(--color-on-surface)" }}>
              Radar Health Score
            </span>
          </div>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{
              background: unresolvedConflicts === 0 ? "#d1fae5" : "#fef9c3",
              color: unresolvedConflicts === 0 ? "#065f46" : "#854d0e",
            }}
          >
            <IconCheck />
            {unresolvedConflicts === 0 ? "Optimal" : "Ada Konflik"}
          </span>
        </div>

        {/* 3-col bento */}
        <div className="grid grid-cols-3 gap-2">
          {/* health ring */}
          <div
            className="flex flex-col items-center justify-center rounded-xl p-3 gap-1"
            style={{ background: "var(--color-surface-low)" }}
          >
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-surface-variant)"
                  strokeWidth="3.5"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="3.5"
                  strokeDasharray={dashArray}
                  strokeLinecap="round"
                />
              </svg>
              <span
                className="absolute text-xs font-extrabold"
                style={{ color: "var(--color-primary)" }}
              >
                {healthScore}%
              </span>
            </div>
            <span className="text-[10px] font-semibold text-center" style={{ color: "var(--color-secondary)" }}>
              Bebas Bentrok
            </span>
          </div>

          {/* total jadwal */}
          <div
            className="flex flex-col items-center justify-center rounded-xl p-3 gap-0.5"
            style={{ background: "var(--color-surface-low)" }}
          >
            <span className="text-2xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
              {totalSchedules}
            </span>
            <span className="text-[10px] font-semibold text-center" style={{ color: "var(--color-secondary)" }}>
              Jadwal Aktif
            </span>
            <span className="text-[10px]" style={{ color: "var(--color-primary)" }}>
              Minggu ini
            </span>
          </div>

          {/* konflik */}
          <div
            className="flex flex-col items-center justify-center rounded-xl p-3 gap-0.5"
            style={{ background: "var(--color-surface-low)" }}
          >
            <span
              className="text-2xl font-extrabold"
              style={{ color: unresolvedConflicts > 0 ? "var(--color-tertiary)" : "var(--color-on-surface)" }}
            >
              {unresolvedConflicts}
            </span>
            <span className="text-[10px] font-semibold text-center" style={{ color: "var(--color-secondary)" }}>
              Konflik
            </span>
            <span
              className="text-[10px]"
              style={{ color: unresolvedConflicts === 0 ? "#059669" : "var(--color-tertiary)" }}
            >
              {unresolvedConflicts === 0 ? "100% Clear" : "Perlu ditangani"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Pengaturan Jadwal & Kalender ── */}
      <SettingsGroup label="Pengaturan Jadwal & Kalender">
        <SettingRow
          icon={<IconSchool />}
          title="Kalender SIAKAD"
          subtitle="Sinkronisasi mata kuliah otomatis"
          right={
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: "#d1fae5", color: "#065f46" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Tersinkron
            </span>
          }
        />
        <SettingRow
          icon={<IconCalendar />}
          title="Google Calendar Sync"
          subtitle={`user@${DUMMY_USER.university.toLowerCase().replace(/ /g, "")}.ac.id`}
          right={
            <div className="flex items-center gap-1">
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed-variant)" }}
              >
                Aktif
              </span>
              <span className="text-secondary"><IconChevron /></span>
            </div>
          }
        />
        <SettingRow
          icon={<IconCategory />}
          title="Kategori Jadwal Kustom"
          last
          right={<span className="text-secondary"><IconAdd /></span>}
        />
        {/* category pills */}
        <div className="px-4 pb-3 flex flex-wrap gap-1.5 pl-16">
          {CUSTOM_CATEGORIES.map((c) => (
            <span
              key={c.label}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: c.bg, color: c.color }}
            >
              {c.label}
            </span>
          ))}
        </div>
      </SettingsGroup>

      {/* ── Preferensi Radar & Deteksi ── */}
      <SettingsGroup label="Preferensi Radar & Deteksi">
        <SettingRow
          icon={<IconBell />}
          title="Peringatan Real-Time"
          subtitle="Pop-up instan saat ada bentrokan baru"
          right={
            <Toggle on={realtimeAlert} onToggle={() => setRealtimeAlert((v) => !v)} />
          }
        />
        <SettingRow
          icon={<IconClock />}
          title="Toleransi Jeda Kelas"
          subtitle="Waktu tempuh pindah gedung/ruang"
          last
          right={
            <div className="flex items-center gap-1">
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                style={{ background: "var(--color-surface-container)", color: "var(--color-on-surface-variant)" }}
              >
                15 Menit
              </span>
              <span className="text-secondary"><IconChevron /></span>
            </div>
          }
        />
      </SettingsGroup>

      {/* ── Akun & Keamanan ── */}
      <SettingsGroup label="Akun & Keamanan">
        <SettingRow
          icon={<span className="text-secondary"><IconLock /></span>}
          title="Ganti Kata Sandi"
          right={<span className="text-secondary"><IconChevron /></span>}
        />
        <SettingRow
          icon={<span className="text-secondary"><IconHelp /></span>}
          title="Bantuan & Dukungan"
          last
          right={<span className="text-secondary"><IconChevron /></span>}
        />
      </SettingsGroup>

      {/* ── Logout ── */}
      <button
        type="button"
        className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-[0.99] cursor-pointer"
        style={{
          background: "rgba(255,218,214,0.6)",
          color: "var(--color-error)",
          border: "1px solid var(--color-error-container)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,218,214,0.9)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,218,214,0.6)")}
      >
        <IconLogout />
        Keluar dari Akun
      </button>

      {/* ── Footer ── */}
      <div className="flex flex-col items-center text-center py-1 gap-0.5">
        <p className="text-xs" style={{ color: "var(--color-secondary)" }}>
          KawanKampus v1.2.0 • Build Mahasiswa
        </p>
        <p className="text-[10px]" style={{ color: "var(--color-outline)" }}>
          Didesain khusus untuk efisiensi jadwal perkuliahan
        </p>
      </div>

    </div>
  );
}