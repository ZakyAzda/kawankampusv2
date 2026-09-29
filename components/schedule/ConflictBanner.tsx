"use client";

import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, CheckCircle2, Flame, ShieldCheck } from "lucide-react";
import { Conflict } from "@/types/schedule";

interface ConflictBannerProps {
  conflicts: Conflict[];
  totalSchedulesCount: number;
}

export default function ConflictBanner({
  conflicts,
  totalSchedulesCount,
}: ConflictBannerProps) {
  const unresolvedConflicts = conflicts.filter((c) => c.status === "unresolved");
  const count = unresolvedConflicts.length;

  if (count === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-variant/80 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-[16px] text-on-surface leading-tight">
              Radar Bersih • Tidak Ada Bentrokan
            </h3>
            <p className="font-sans text-[13px] text-secondary mt-0.5">
              Semua {totalSchedulesCount} agenda kamu tersinkronisasi aman tanpa tabrakan waktu.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-semibold">
          <ShieldCheck className="w-4 h-4" />
          <span>Status Optimal</span>
        </div>
      </div>
    );
  }

  // Calculate total clash minutes
  const totalClashMinutes = unresolvedConflicts.reduce((sum, c) => sum + (c.overlapMinutes || 0), 0);
  const firstConflictId = unresolvedConflicts[0]?.id;

  return (
    <div className="bg-tertiary-fixed rounded-2xl p-4 md:p-5 flex flex-col gap-4 relative overflow-hidden shadow-sm border border-tertiary-container/20">
      {/* Decorative ambient background blur */}
      <div 
        className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-tertiary-fixed-dim/40 blur-2xl pointer-events-none" 
        aria-hidden="true"
      />

      {/* Header Alert Strip */}
      <div className="flex items-start justify-between z-10 gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-tertiary-container text-on-tertiary flex items-center justify-center shadow-sm shrink-0">
            <AlertTriangle className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-sans font-bold text-[17px] text-on-tertiary-fixed leading-tight">
              {count} Konflik Jadwal Terdeteksi!
            </h3>
            <p className="font-sans text-[13px] text-on-tertiary-fixed-variant mt-0.5">
              Potensi tumpang tindih waktu teridentifikasi pada jadwal kegiatanmu.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-3 gap-2.5 z-10 pt-1">
        <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-xl flex flex-col shadow-sm">
          <span className="font-sans font-bold text-[20px] text-on-surface leading-none tabular-nums">
            {totalSchedulesCount}
          </span>
          <span className="font-mono text-[11px] font-medium text-secondary mt-1">
            Total Agenda
          </span>
        </div>

        <div className="bg-tertiary-container text-on-tertiary p-3 rounded-xl flex flex-col shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-sans font-bold text-[20px] text-on-tertiary leading-none tabular-nums">
              {count}
            </span>
            <Flame className="w-4 h-4 text-on-tertiary animate-pulse" />
          </div>
          <span className="font-mono text-[11px] font-semibold text-on-tertiary-container mt-1">
            Bentrok!
          </span>
        </div>

        <div className="bg-surface-container-lowest/90 backdrop-blur-sm p-3 rounded-xl flex flex-col shadow-sm">
          <span className="font-sans font-bold text-[20px] text-on-surface leading-none tabular-nums">
            {totalClashMinutes}m
          </span>
          <span className="font-mono text-[11px] font-medium text-secondary mt-1">
            Total Tabrakan
          </span>
        </div>
      </div>

      {/* Resolution Action Link */}
      <Link
        href={firstConflictId ? `/conflict/${firstConflictId}` : "/weekly"}
        className="flex items-center justify-between pt-1 z-10 group cursor-pointer border-t border-tertiary-container/10 mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary rounded-lg"
      >
        <span className="font-sans font-bold text-[14px] text-tertiary group-hover:underline">
          Lihat & Selesaikan Bentrokan Sekarang
        </span>
        <div className="w-7 h-7 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center group-hover:translate-x-1 transition-transform">
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </div>
      </Link>
    </div>
  );
}
