"use client";

import React from "react";
import { Loader2, LucideIcon } from "lucide-react";

interface SecondaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  loading?: boolean;
  fullWidth?: boolean;
}

export default function SecondaryButton({
  children,
  icon: Icon,
  loading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: SecondaryButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`min-h-[44px] px-4 py-2.5 rounded-xl text-[14px] font-medium bg-surface-container-low text-on-surface hover:bg-surface-container active:scale-[0.98] transition-all duration-200 inline-flex items-center justify-center gap-2 border border-surface-variant/70 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 text-secondary" />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
}
