"use client";

import React, { useState } from "react";
import { WarningAlert } from "@/types/schedule";

interface WarningCardProps {
  alerts: WarningAlert[];
  onDismiss?: (id: string) => void;
}

export default function WarningCard({ alerts, onDismiss }: WarningCardProps) {
  const [activeAlerts, setActiveAlerts] = useState<WarningAlert[]>(alerts);

  const handleDismiss = (id: string) => {
    setActiveAlerts((prev) => prev.filter((item) => item.id !== id));
    if (onDismiss) onDismiss(id);
  };

  if (activeAlerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 w-full">
      {activeAlerts.map((alert, i) => {
        const isUrgent = alert.type === "urgent";
        const isWarning = alert.type === "warning";

        const accent = isUrgent
          ? { bar: "#dc2626", badgeBg: "#fef2f2", badgeText: "#dc2626", badgeBorder: "#fecaca", label: "Mendesak", iconColor: "#dc2626", iconBg: "#fef2f2" }
          : isWarning
          ? { bar: "#d97706", badgeBg: "#fffbeb", badgeText: "#d97706", badgeBorder: "#fde68a", label: "Peringatan", iconColor: "#d97706", iconBg: "#fffbeb" }
          : { bar: "#4f46e5", badgeBg: "#eef2ff", badgeText: "#4f46e5", badgeBorder: "#c7d2fe", label: "Informasi", iconColor: "#4f46e5", iconBg: "#eef2ff" };

        return (
          <div
            key={alert.id}
            className="relative overflow-hidden rounded-xl border transition-all duration-200 fade-slide-up"
            style={{
              animationDelay: `${i * 0.05}s`,
              background: "#ffffff",
              borderColor: "#e8eaf0",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            {/* Left accent bar */}
            <div
              className="absolute top-0 left-0 bottom-0 w-1"
              style={{ background: accent.bar, borderRadius: "4px 0 0 4px" }}
            />

            <div className="flex items-start gap-3 p-4 pl-5">
              {/* Icon */}
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ background: accent.iconBg, border: `1px solid ${accent.badgeBorder}` }}
              >
                <svg className="w-4 h-4" fill="none" stroke={accent.iconColor} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Tags */}
                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                  <span
                    className="text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
                    style={{ background: accent.badgeBg, color: accent.badgeText, border: `1px solid ${accent.badgeBorder}` }}
                  >
                    {accent.label}
                  </span>
                  {alert.courseName && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded" style={{ background: "#f1f3f8", color: "#6b7280" }}>
                      {alert.courseName}
                    </span>
                  )}
                  <span className="text-[11px]" style={{ color: "#9ca3af" }}>
                    {alert.timestamp}
                  </span>
                </div>

                <h4 className="font-semibold text-sm mb-1" style={{ color: "#111827" }}>
                  {alert.title}
                </h4>
                <p className="text-xs leading-relaxed" style={{ color: "#6b7280" }}>
                  {alert.message}
                </p>

                {alert.actionText && (
                  <button
                    type="button"
                    className="mt-2 text-xs font-semibold flex items-center gap-1 transition-opacity hover:opacity-70 cursor-pointer"
                    style={{ color: accent.bar }}
                  >
                    {alert.actionText}
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Dismiss */}
              <button
                type="button"
                onClick={() => handleDismiss(alert.id)}
                className="shrink-0 p-1 rounded-md transition-colors cursor-pointer hover:bg-gray-100"
                style={{ color: "#9ca3af" }}
                title="Tutup"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
