"use client";

import React from "react";
import { Loader2, LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  variant?: "primary" | "danger";
  fullWidth?: boolean;
}

export default function PrimaryButton({
  children,
  icon: Icon,
  iconPosition = "left",
  loading = false,
  variant = "primary",
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const bgClass =
    variant === "danger"
      ? "bg-tertiary hover:bg-tertiary-container text-on-tertiary shadow-sm shadow-tertiary/20"
      : "bg-primary hover:bg-primary-container text-on-primary shadow-sm shadow-primary/20";

  return (
    <button
      disabled={disabled || loading}
      className={`min-h-[44px] px-5 py-2.5 rounded-xl text-[14px] font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${bgClass} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="w-4 h-4 stroke-[2.2]" />}
          <span>{children}</span>
          {Icon && iconPosition === "right" && <Icon className="w-4 h-4 stroke-[2.2]" />}
        </>
      )}
    </button>
  );
}
