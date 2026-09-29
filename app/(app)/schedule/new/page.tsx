"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  School,
  Users,
  Calendar as CalendarIcon,
  MapPin,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Radar,
  X,
} from "lucide-react";
import FormField from "@/components/ui/FormField";
import DayPicker from "@/components/ui/DayPicker";
import TimeRangeInput from "@/components/ui/TimeRangeInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Schedule, ScheduleCategory } from "@/types/schedule";

function timeToMinutes(t: string): number {
  if (!t || !t.includes(":")) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function AddSchedulePage() {
  const router = useRouter();

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ScheduleCategory>("kuliah");
  const [day, setDay] = useState("senin");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [priority, setPriority] = useState<"wajib" | "fleksibel">("wajib");
  const [notes, setNotes] = useState("");

  // Academic specific fields
  const [sks, setSks] = useState("3");
  const [lecturer, setLecturer] = useState("");

  // Organization specific field
  const [role, setRole] = useState("");

  // Submission & validation state
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Existing schedules for real-time live radar validation
  const [existingSchedules, setExistingSchedules] = useState<Schedule[]>([]);
  const [loadingExisting, setLoadingExisting] = useState(false);

  // Fetch existing schedules from DB to perform real-time collision preview
  useEffect(() => {
    async function fetchSchedules() {
      try {
        setLoadingExisting(true);
        const res = await fetch("/api/schedules", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setExistingSchedules(data.schedules || []);
        }
      } catch (err) {
        console.error("Failed to load existing schedules:", err);
      } finally {
        setLoadingExisting(false);
      }
    }
    fetchSchedules();
  }, []);

  // Time validity check
  const isTimeValid = useMemo(() => {
    const s = timeToMinutes(startTime);
    const e = timeToMinutes(endTime);
    return e > s;
  }, [startTime, endTime]);

  // Real-time collision calculation on current day
  const realTimeCollisions = useMemo(() => {
    if (!isTimeValid) return [];
    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    return existingSchedules
      .filter((s) => s.day?.toLowerCase() === day.toLowerCase())
      .filter((s) => {
        const sStart = timeToMinutes(s.startTime);
        const sEnd = timeToMinutes(s.endTime);
        return newStart < sEnd && newEnd > sStart;
      });
  }, [existingSchedules, day, startTime, endTime, isTimeValid]);

  // Handle form submission to POST /api/schedules
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Nama kegiatan wajib diisi");
      return;
    }

    if (!isTimeValid) {
      setFormError("Jam selesai harus lebih akhir dari jam mulai");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        name: name.trim(),
        category,
        day,
        startTime,
        endTime,
        location: location.trim(),
        notes: notes.trim(),
        priority,
        isRoutine: true,
        ...(category === "kuliah" && {
          sks: sks ? Number(sks) : undefined,
          lecturer: lecturer.trim() || undefined,
        }),
        ...(category === "organisasi" && {
          role: role.trim() || undefined,
        }),
      };

      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal menyimpan jadwal kegiatan");
      }

      // If collision detected on backend, redirect to home or conflict
      if (data.hasCollision && data.collisions?.length > 0) {
        router.push(`/conflict/${data.collisions[0].conflictId}`);
      } else {
        router.push("/home");
      }
    } catch (err: any) {
      console.error("Submit Schedule Error:", err);
      setFormError(err?.message || "Terjadi kesalahan server saat menyimpan jadwal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Top Breadcrumb & Page Heading */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/home"
            aria-label="Kembali ke Beranda"
            className="w-10 h-10 rounded-xl bg-surface-container-low border border-surface-variant/80 flex items-center justify-center text-on-surface hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="font-sans font-bold text-[20px] md:text-[24px] text-on-surface tracking-tight">
              Tambah Jadwal Baru
            </h1>
            <span className="font-sans text-[12px] md:text-[13px] text-secondary">
              Input kuliah, kegiatan organisasi, atau agenda harian
            </span>
          </div>
        </div>

        {/* Real-time radar detector badge */}
        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-container text-on-secondary-fixed text-[12px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>Deteksi Bentrok Real-Time</span>
        </div>
      </div>

      {/* Responsive Form Layout: 2 Columns on Desktop (Form on left, Radar preview on right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ==================================================================
            LEFT COLUMN (lg:col-span-7): The Primary Form
            ================================================================== */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-5 md:p-7 border border-surface-variant/80 shadow-sm flex flex-col gap-6"
        >
          {/* General Form Error Alert */}
          {formError && (
            <div
              role="alert"
              className="p-4 rounded-xl bg-error-container text-on-error-container text-[13px] font-medium flex items-center gap-2.5 border border-error/20"
            >
              <AlertTriangle className="w-5 h-5 text-error shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* 1. Nama Kegiatan */}
          <FormField
            label="Nama Kegiatan / Mata Kuliah"
            placeholder="contoh: Basis Data II / Rapat Dies Natalis"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            rightSlot={
              name ? (
                <button
                  type="button"
                  onClick={() => setName("")}
                  aria-label="Hapus teks kegiatan"
                  className="p-1 rounded-full text-outline hover:text-on-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null
            }
          />

          {/* 2. Kategori Pill Selectors */}
          <div className="flex flex-col gap-2">
            <label className="font-sans font-semibold text-[13px] md:text-[14px] text-on-surface">
              Kategori Agenda
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory("kuliah")}
                className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  category === "kuliah"
                    ? "bg-primary text-on-primary border-primary shadow-sm"
                    : "bg-surface-container-low text-secondary border-surface-variant/80 hover:bg-surface-container"
                }`}
              >
                <School className="w-4 h-4" />
                <span>Kuliah</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("organisasi")}
                className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  category === "organisasi"
                    ? "bg-secondary text-white border-secondary shadow-sm"
                    : "bg-surface-container-low text-secondary border-surface-variant/80 hover:bg-surface-container"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Organisasi</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory("lainnya")}
                className={`min-h-[44px] rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold transition-all duration-200 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  category === "lainnya"
                    ? "bg-surface-container-highest text-on-surface border-surface-variant shadow-sm"
                    : "bg-surface-container-low text-secondary border-surface-variant/80 hover:bg-surface-container"
                }`}
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Lainnya</span>
              </button>
            </div>
          </div>

          {/* 3. Hari Pelaksanaan */}
          <DayPicker selectedDay={day} onSelectDay={setDay} />

          {/* 4. Rentang Waktu (Jam Mulai & Jam Selesai dengan live validation) */}
          <TimeRangeInput
            startTime={startTime}
            endTime={endTime}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
          />

          {/* 5. Conditional Category-Specific Fields */}
          {category === "kuliah" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-surface-container-low border border-surface-variant/60">
              <FormField
                label="Jumlah SKS"
                type="number"
                placeholder="contoh: 3"
                value={sks}
                onChange={(e) => setSks(e.target.value)}
              />
              <FormField
                label="Dosen Pengampu (Opsional)"
                placeholder="contoh: Dr. Eng. Budi"
                value={lecturer}
                onChange={(e) => setLecturer(e.target.value)}
              />
            </div>
          )}

          {category === "organisasi" && (
            <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-variant/60">
              <FormField
                label="Peran / Divisi (Opsional)"
                placeholder="contoh: Koordinator Lapangan / Sekretaris"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          )}

          {/* 6. Lokasi Kegiatan */}
          <FormField
            label="Lokasi / Ruangan (Opsional)"
            placeholder="contoh: Gedung Fasilkom Ruang 2.304 / Zoom"
            icon={<MapPin className="w-4 h-4 text-secondary" />}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          {/* 7. Catatan Tambahan */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="notes-field"
              className="font-sans font-semibold text-[13px] md:text-[14px] text-on-surface"
            >
              Catatan Khusus (Opsional)
            </label>
            <textarea
              id="notes-field"
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan persiapan, link berkas tugas, atau info penting..."
              className="w-full p-3.5 rounded-xl font-sans text-[15px] bg-surface-container-low text-on-surface border border-surface-variant/80 hover:border-surface-variant focus:bg-surface-container focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>

          {/* Submit Action Button */}
          <div className="pt-2">
            <PrimaryButton
              type="submit"
              loading={submitting}
              fullWidth
              className="min-h-[50px] text-[15px]"
            >
              Simpan & Aktifkan Radar Jadwal
            </PrimaryButton>
          </div>
        </form>

        {/* ==================================================================
            RIGHT COLUMN (lg:col-span-5): Live Radar Collision Preview
            ================================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-5 lg:sticky lg:top-24">
          {/* Real-time Radar Collision Warning Card */}
          <div
            className={`rounded-2xl p-5 border shadow-sm transition-all duration-300 flex flex-col gap-4 ${
              realTimeCollisions.length > 0
                ? "bg-tertiary-fixed border-tertiary-container/30 text-on-tertiary-fixed"
                : "bg-surface-container-lowest border-surface-variant/80 text-on-surface"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    realTimeCollisions.length > 0
                      ? "bg-tertiary-container text-on-tertiary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Radar className="w-4 h-4" />
                </div>
                <h3 className="font-sans font-bold text-[15px]">
                  Radar Validasi Waktu
                </h3>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  realTimeCollisions.length > 0
                    ? "bg-tertiary-container text-on-tertiary animate-pulse"
                    : "bg-emerald-50 text-emerald-800"
                }`}
              >
                {realTimeCollisions.length > 0 ? "BENTROK WAKTU!" : "JAM AMAN"}
              </span>
            </div>

            {realTimeCollisions.length > 0 ? (
              <div className="flex flex-col gap-2.5 text-[13px]">
                <p className="font-medium text-on-tertiary-fixed-variant leading-relaxed">
                  ⚠️ <strong>Peringatan Real-Time:</strong> Waktu yang kamu pilih (<strong>{startTime} – {endTime}</strong>) bertabrakan dengan agenda lain pada hari <strong>{day.toUpperCase()}</strong>:
                </p>
                <div className="flex flex-col gap-2 mt-1">
                  {realTimeCollisions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-surface-container-lowest/90 backdrop-blur-sm border border-tertiary/20 text-on-surface flex items-center justify-between"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-[14px]">{item.name}</span>
                        <span className="font-mono text-[12px] text-secondary">
                          {item.startTime} – {item.endTime}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-tertiary-container text-on-tertiary">
                        Bentrok
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[12px] text-on-tertiary-fixed-variant mt-1">
                  Jadwal tetap dapat disimpan, namun sistem radar akan langsung menandainya sebagai konflik yang perlu diselesaikan.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-[13px] text-secondary">
                <p>
                  Tidak terdeteksi tabrakan waktu pada hari <strong>{day.toUpperCase()}</strong> di rentang <strong>{startTime} – {endTime}</strong>.
                </p>
                <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[12px] mt-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Jadwal dapat disimpan dengan aman!</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Academic Tip Box */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-variant/60 flex flex-col gap-2">
            <span className="font-sans font-bold text-[13px] text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Saran Waktu Kuliah
            </span>
            <p className="font-sans text-[12px] text-secondary leading-relaxed">
              Beri jeda minimal 15 menit sebelum dan sesudah jadwal kuliah untuk persiapan absensi, materi, dan perpindahan kelas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
