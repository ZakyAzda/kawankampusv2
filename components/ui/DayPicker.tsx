"use client";

import React from "react";

export interface DayOption {
  key: string;
  shortLabel: string;
  fullLabel: string;
}

export const DAYS: DayOption[] = [
  { key: "senin", shortLabel: "Sen", fullLabel: "Senin" },
  { key: "selasa", shortLabel: "Sel", fullLabel: "Selasa" },
  { key: "rabu", shortLabel: "Rab", fullLabel: "Rabu" },
  { key: "kamis", shortLabel: "Kam", fullLabel: "Kamis" },
  { key: "jumat", shortLabel: "Jum", fullLabel: "Jumat" },
  { key: "sabtu", shortLabel: "Sab", fullLabel: "Sabtu" },
  { key: "minggu", shortLabel: "Min", fullLabel: "Minggu" },
];

interface DayPickerProps {
  selectedDay: string;
  onSelectDay: (day: string) => void;
  clashingDays?: string[];
  label?: string;
}

export default function DayPicker({
  selectedDay,
  onSelectDay,
  clashingDays = [],
  label = "Hari Pelaksanaan",
}: DayPickerProps) {
  const activeDayOption = DAYS.find((d) => d.key === selectedDay.toLowerCase()) || DAYS[0];

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <label className="font-sans font-semibold text-[13px] md:text-[14px] text-on-surface">
          {label}
        </label>
        <span className="font-sans text-[12px] font-medium text-secondary">
          {activeDayOption.fullLabel} Terpilih
        </span>
      </div>

      <div
        role="group"
        aria-label="Pilih Hari"
        className="flex items-center justify-between gap-1.5 sm:gap-2 overflow-x-auto py-1 no-scrollbar"
      >
        {DAYS.map((day) => {
          const isSelected = selectedDay.toLowerCase() === day.key;
          const hasClash = clashingDays.includes(day.key);

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onSelectDay(day.key)}
              aria-pressed={isSelected}
              className={`flex-1 min-w-[42px] max-w-[52px] h-12 rounded-xl flex flex-col items-center justify-center font-mono text-[13px] font-semibold transition-all duration-200 relative select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                isSelected
                  ? "bg-primary text-on-primary shadow-md scale-105 z-10"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              }`}
            >
              <span>{day.shortLabel}</span>

              {/* Clash warning indicator dot */}
              {hasClash && (
                <span
                  className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${
                    isSelected ? "bg-tertiary-fixed" : "bg-tertiary animate-pulse"
                  }`}
                  title="Ada jadwal bentrok pada hari ini"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
