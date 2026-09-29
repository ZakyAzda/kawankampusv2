"use client";

import React, { useMemo } from "react";
import { Clock, AlertTriangle, CheckCircle2, Timer } from "lucide-react";

interface TimeRangeInputProps {
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  label?: string;
}

function timeToMinutes(t: string): number {
  if (!t || !t.includes(":")) return 0;
  const [h, m] = t.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export default function TimeRangeInput({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label = "Rentang Waktu Kegiatan",
}: TimeRangeInputProps) {
  const startMin = useMemo(() => timeToMinutes(startTime), [startTime]);
  const endMin = useMemo(() => timeToMinutes(endTime), [endTime]);

  const isValid = endMin > startMin;
  const durationMinutes = isValid ? endMin - startMin : 0;

  const durationText = useMemo(() => {
    if (!isValid) return "Durasi Waktu Tidak Valid";
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    if (hours === 0) return `Durasi: ${minutes} Menit`;
    if (minutes === 0) return `Durasi: ${hours} Jam (${durationMinutes} Menit)`;
    return `Durasi: ${hours} Jam ${minutes} Menit (${durationMinutes} Menit)`;
  }, [isValid, durationMinutes]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="font-sans font-semibold text-[13px] md:text-[14px] text-on-surface">
          {label}
        </label>
        {isValid ? (
          <span className="font-sans text-[12px] text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Valid
          </span>
        ) : (
          <span className="font-sans text-[12px] text-error font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            Waktu Tidak Valid
          </span>
        )}
      </div>

      {/* Grid 2 Columns for Start & End Time Inputs */}
      <div className="grid grid-cols-2 gap-3">
        {/* Jam Mulai */}
        <div
          className={`flex flex-col p-3 rounded-2xl transition-all duration-200 border ${
            !isValid
              ? "bg-error-container/15 border-error/50"
              : "bg-surface-container-low border-surface-variant/80 hover:bg-surface-container"
          }`}
        >
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="font-sans text-[12px] font-medium">Jam Mulai</span>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            className="w-full bg-transparent font-mono text-[18px] md:text-[20px] font-bold text-on-surface focus:outline-none cursor-pointer"
            aria-label="Jam Mulai"
          />
        </div>

        {/* Jam Selesai */}
        <div
          className={`flex flex-col p-3 rounded-2xl transition-all duration-200 border ${
            !isValid
              ? "bg-error-container/20 border-2 border-error"
              : "bg-surface-container-low border-surface-variant/80 hover:bg-surface-container"
          }`}
        >
          <div className="flex items-center justify-between text-secondary mb-1">
            <span className="font-sans text-[12px] font-medium">Jam Selesai</span>
            <Clock className={`w-4 h-4 ${isValid ? "text-primary" : "text-error"}`} />
          </div>
          <input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            className={`w-full bg-transparent font-mono text-[18px] md:text-[20px] font-bold focus:outline-none cursor-pointer ${
              isValid ? "text-on-surface" : "text-error font-extrabold"
            }`}
            aria-label="Jam Selesai"
          />
        </div>
      </div>

      {/* Duration & Error State Banner */}
      {!isValid ? (
        <div
          role="alert"
          className="flex items-start gap-2 p-3 rounded-xl bg-error-container/40 border border-error/30 text-error text-[12px] md:text-[13px] font-medium mt-0.5"
        >
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold">Kesalahan Jam Selesai:</span>
            <span>Jam selesai harus lebih akhir dari jam mulai. Durasi kegiatan tidak boleh 0 menit atau bernilai negatif.</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container self-start">
          <Timer className="w-4 h-4 text-secondary" />
          <span className="font-mono text-[12px] font-medium text-secondary">
            {durationText}
          </span>
        </div>
      )}
    </div>
  );
}
