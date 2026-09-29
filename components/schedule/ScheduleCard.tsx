"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  MapPin, 
  School, 
  Users, 
  Calendar, 
  AlertTriangle, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Schedule } from "@/types/schedule";

interface ScheduleCardProps {
  schedule: Schedule;
  isColliding?: boolean;
  conflictId?: string;
}

export default function ScheduleCard({
  schedule,
  isColliding = false,
  conflictId,
}: ScheduleCardProps) {
  const isKuliah = schedule.category?.toLowerCase() === "kuliah";
  const isOrganisasi = schedule.category?.toLowerCase() === "organisasi";

  const getCategoryDetails = () => {
    if (isKuliah) {
      return {
        label: "Kuliah",
        icon: School,
        barColor: "bg-primary",
        badgeBg: "bg-primary-fixed text-on-primary-fixed-variant",
      };
    }
    if (isOrganisasi) {
      return {
        label: "Organisasi",
        icon: Users,
        barColor: "bg-secondary",
        badgeBg: "bg-secondary-fixed text-on-secondary-fixed",
      };
    }
    return {
      label: "Lainnya",
      icon: Calendar,
      barColor: "bg-outline",
      badgeBg: "bg-surface-container text-on-surface-variant",
    };
  };

  const cat = getCategoryDetails();
  const CategoryIcon = cat.icon;

  return (
    <div
      className={`relative bg-surface-container-lowest rounded-2xl p-4 md:p-5 shadow-sm border transition-all duration-200 hover:shadow-md flex flex-col gap-3 overflow-hidden ${
        isColliding
          ? "border-tertiary/40 bg-gradient-to-r from-tertiary-fixed/30 to-surface-container-lowest ring-1 ring-tertiary/20"
          : "border-surface-variant/70 hover:border-surface-variant"
      }`}
    >
      {/* Category colored indicator strip */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          isColliding ? "bg-tertiary" : cat.barColor
        }`}
        aria-hidden="true"
      />

      {/* Top Header Row: Category Badge & Time */}
      <div className="flex items-center justify-between gap-2 pl-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-semibold ${cat.badgeBg}`}
          >
            <CategoryIcon className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
          </span>

          {isColliding && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container text-on-tertiary text-[11px] font-bold shadow-sm animate-pulse">
              <AlertTriangle className="w-3 h-3 stroke-[2.5]" />
              <span>BENTROK WAKTU</span>
            </span>
          )}
        </div>

        {/* Time display with tabular numerals */}
        <div className="flex items-center gap-1.5 text-on-surface font-mono text-[13px] font-semibold bg-surface-container-low px-2.5 py-1 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-secondary" />
          <span>
            {schedule.startTime} – {schedule.endTime}
          </span>
        </div>
      </div>

      {/* Main Title & Details */}
      <div className="flex flex-col pl-1.5">
        <h3 className="font-sans font-bold text-[16px] md:text-[17px] text-on-surface leading-snug">
          {schedule.name}
        </h3>

        {/* Metadata sub-row */}
        <div className="flex items-center gap-3 text-[13px] text-secondary mt-1.5 flex-wrap">
          {schedule.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span className="truncate">{schedule.location}</span>
            </span>
          )}

          {isKuliah && schedule.sks && (
            <span className="font-mono text-[12px] bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">
              {schedule.sks} SKS
            </span>
          )}

          {isKuliah && schedule.lecturer && (
            <span className="truncate text-on-surface-variant font-medium">
              {schedule.lecturer}
            </span>
          )}

          {isOrganisasi && schedule.role && (
            <span className="truncate text-secondary font-medium">
              Peran: {schedule.role}
            </span>
          )}
        </div>

        {schedule.notes && (
          <p className="text-[12px] text-secondary/90 italic mt-2 line-clamp-1 border-t border-surface-variant/40 pt-1.5">
            "{schedule.notes}"
          </p>
        )}
      </div>

      {/* If colliding, show direct link to conflict resolution */}
      {isColliding && (
        <div className="pl-1.5 pt-2 border-t border-tertiary/20 flex items-center justify-between">
          <span className="text-[12px] font-medium text-tertiary flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Rekomendasi resolusi tersedia
          </span>
          <Link
            href={conflictId ? `/conflict/${conflictId}` : "/weekly"}
            className="text-[12px] font-bold text-tertiary flex items-center gap-1 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-tertiary rounded"
          >
            <span>Tinjau Bentrok</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
