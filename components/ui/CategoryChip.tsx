"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface CategoryChipProps {
  label: string;
  icon?: LucideIcon;
  count?: number;
  active?: boolean;
  onClick?: () => void;
  variant?: "default" | "kuliah" | "organisasi" | "conflict";
}

export default function CategoryChip({
  label,
  icon: Icon,
  count,
  active = false,
  onClick,
  variant = "default",
}: CategoryChipProps) {
  const getActiveClass = () => {
    switch (variant) {
      case "conflict":
        return "bg-tertiary text-on-tertiary shadow-sm ring-1 ring-tertiary";
      case "kuliah":
        return "bg-primary text-on-primary shadow-sm";
      case "organisasi":
        return "bg-secondary text-white shadow-sm";
      default:
        return "bg-surface-container-highest text-on-surface font-semibold shadow-sm";
    }
  };

  const getInactiveClass = () => {
    if (variant === "conflict") {
      return "bg-error-container/50 text-tertiary hover:bg-error-container";
    }
    return "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface";
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[38px] px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 shrink-0 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        active ? getActiveClass() : getInactiveClass()
      }`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${active ? "opacity-100" : "opacity-75"}`} />}
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={`px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums ml-0.5 ${
            active ? "bg-black/15 text-inherit" : "bg-surface-container text-on-surface-variant"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
