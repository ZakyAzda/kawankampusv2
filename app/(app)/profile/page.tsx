"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DUMMY_USER } from "@/data/schedules";
import { useScheduleStore } from "@/store/useScheduleStore";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  nim?: string | null;
  university?: string | null;
  major?: string | null;
  semester?: number | null;
  createdAt: string;
  scheduleCount: number;
  conflictCount: number;
  unresolvedConflicts: number;
  schedulesByCategory?: Record<string, number>;
}

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
  onClick,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  right: React.ReactNode;
  last?: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-3 transition-colors ${
        onClick || href ? "cursor-pointer hover:bg-[var(--color-surface-container-low)]" : ""
      }`}
    >
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
  );

  return (
    <>
      {href ? (
        <Link href={href} style={{ textDecoration: "none" }}>
          {content}
        </Link>
      ) : (
        content
      )}
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
  const router = useRouter();
  const { schedules, conflicts } = useScheduleStore();
  const [realtimeAlert, setRealtimeAlert] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/me");
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data.user);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch {
      setLoggingOut(false);
    }
  }

  /* ── derived stats ── */
  const totalSchedules = userProfile ? userProfile.scheduleCount : schedules.length;
  const unresolvedConflicts = userProfile
    ? userProfile.unresolvedConflicts
    : conflicts.length;
  const safeCount = Math.max(0, totalSchedules - unresolvedConflicts);
  const healthScore =
    totalSchedules === 0 ? 100 : Math.round((safeCount / totalSchedules) * 100);

  /* SVG circle health ring — values out of 100 */
  const dashArray = `${healthScore}, 100`;

  const displayName = userProfile?.name || DUMMY_USER.name;
  const displayNim = userProfile?.nim || DUMMY_USER.nim;
  const displayUniversity = userProfile?.university || DUMMY_USER.university;
  const displayMajor = userProfile?.major || DUMMY_USER.faculty;
  const displaySemester = userProfile?.semester || DUMMY_USER.semester;
  const initial = displayName.charAt(0).toUpperCase() || "U";

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
              {initial}
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
              {displayName}
            </h2>
            <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "var(--color-on-surface-variant)" }}>
              {displayMajor} • {displayUniversity}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {displayNim && (
                <span
                  className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md"
                  style={{ background: "var(--color-surface-low)", color: "var(--color-secondary)" }}
                >
                  NIM {displayNim}
                </span>
              )}
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed-variant)" }}
              >
                Semester {displaySemester}
              </span>
            </div>
          </div>
        </div>

        {/* quick status row */}
        <div
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs"
          style={{ background: "var(--color-surface-low)" }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="font-semibold" style={{ color: "var(--color-on-surface)" }}>
              Semester {displaySemester} • Aktif
            </span>
          </div>
          <span className="text-[11px] font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline">
            SIAKAD UI
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </span>
        </div>
      </div>

      {/* ── Radar Health Score Bento ── */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3 shadow-sm"
        style={{
          background: "var(--color-surface-lowest)",
          border: "1px solid var(--color-surface-high)",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-primary"
              style={{ background: "var(--color-primary-fixed)" }}
            >
              <IconRadar />
            </div>
            <span className="text-sm font-bold" style={{ color: "var(--color-on-surface)" }}>
              Radar Health Score
            </span>
          </div>
          <span
            className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
            style={{
              background: healthScore >= 80 ? "#d1fae5" : "#fee2e2",
              color: healthScore >= 80 ? "#065f46" : "#991b1b",
            }}
          >
            <IconCheck />
            {healthScore >= 90 ? "Optimal" : healthScore >= 70 ? "Baik" : "Perlu Evaluasi"}
          </span>
        </div>

        {/* 3 bento stat columns */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          {/* Ring + score */}
          <div
            className="flex flex-col items-center justify-center py-3 px-2 rounded-xl"
            style={{ background: "var(--color-surface-low)" }}
          >
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--color-surface-high)"
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
              <span className="absolute font-mono text-xs font-extrabold text-primary">
                {healthScore}%
              </span>
            </div>
            <span className="text-[10px] font-medium text-secondary mt-1.5 text-center leading-tight">
              Bebas Bentrok
            </span>
          </div>

          {/* Jadwal Aktif */}
          <div
            className="flex flex-col items-center justify-center py-3 px-2 rounded-xl text-center"
            style={{ background: "var(--color-surface-low)" }}
          >
            <span className="text-2xl font-extrabold text-on-surface">
              {totalSchedules}
            </span>
            <span className="text-[10px] font-medium text-secondary mt-0.5 leading-tight">
              Jadwal Aktif
            </span>
            <span className="text-[9px] font-bold text-primary mt-1">
              Minggu ini
            </span>
          </div>

          {/* Konflik Selesai */}
          <div
            className="flex flex-col items-center justify-center py-3 px-2 rounded-xl text-center"
            style={{ background: "var(--color-surface-low)" }}
          >
            <div className="flex items-center gap-1">
              <span
                className="text-2xl font-extrabold"
                style={{ color: unresolvedConflicts > 0 ? "var(--color-tertiary)" : "#059669" }}
              >
                {unresolvedConflicts}
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[10px] font-medium text-secondary mt-0.5 leading-tight">
              Bentrokan
            </span>
            <span
              className="text-[9px] font-bold mt-1"
              style={{ color: unresolvedConflicts === 0 ? "#059669" : "var(--color-tertiary)" }}
            >
              {unresolvedConflicts === 0 ? "100% Clear" : "Perlu Selesai"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Jadwal & Kalender Settings ── */}
      <SettingsGroup label="Jadwal & Kalender">
        <SettingRow
          icon={<IconSchool />}
          title="Sinkronisasi SIAKAD"
          subtitle="Terhubung otomatis ke portal akademik"
          right={
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
              style={{ background: "#d1fae5", color: "#065f46" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Aktif
            </span>
          }
        />
        <SettingRow
          icon={<IconCalendar />}
          title="Ekspor Kalender"
          subtitle="Google Calendar, iCal (.ics)"
          right={
            <div className="flex items-center gap-1">
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "var(--color-surface-container)", color: "var(--color-on-surface-variant)" }}
              >
                .ICS
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
          href="/profile/change-password"
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
        onClick={handleLogout}
        disabled={loggingOut}
        className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
        style={{
          background: "rgba(255,218,214,0.6)",
          color: "var(--color-error)",
          border: "1px solid var(--color-error-container)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,218,214,0.9)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,218,214,0.6)")}
      >
        <IconLogout />
        {loggingOut ? "Mengeluarkan akun..." : "Keluar dari Akun"}
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
