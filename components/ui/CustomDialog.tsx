"use client";

import React, { useEffect, useRef } from "react";
import { AlertTriangle, Info, CheckCircle, XCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

export type DialogVariant = "info" | "warning" | "danger" | "success";

export interface DialogConfig {
  title: string;
  message: React.ReactNode;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

interface Props extends DialogConfig {
  open: boolean;
}

const VARIANT_MAP: Record<
  DialogVariant,
  { icon: React.ReactNode }
> = {
  info: { icon: <Info className="w-6 h-6" /> },
  warning: { icon: <AlertTriangle className="w-6 h-6" /> },
  danger: { icon: <XCircle className="w-6 h-6" /> },
  success: { icon: <CheckCircle className="w-6 h-6" /> },
};

const VARIANT_STYLES: Record<
  DialogVariant,
  {
    accentGradient: string;
    iconBg: string;
    iconColor: string;
    iconRing: string;
    btnGradient: string;
    btnShadow: string;
  }
> = {
  info: {
    accentGradient: "linear-gradient(90deg, #3b82f6, #1d4ed8)",
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
    iconRing: "rgba(59,130,246,0.1)",
    btnGradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    btnShadow: "0 4px 14px rgba(37,99,235,0.35)",
  },
  warning: {
    accentGradient: "linear-gradient(90deg, #f59e0b, #d97706)",
    iconBg: "#fffbeb",
    iconColor: "#d97706",
    iconRing: "rgba(245,158,11,0.1)",
    btnGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    btnShadow: "0 4px 14px rgba(217,119,6,0.35)",
  },
  danger: {
    accentGradient: "linear-gradient(90deg, #ef4444, #dc2626)",
    iconBg: "#fef2f2",
    iconColor: "#dc2626",
    iconRing: "rgba(239,68,68,0.1)",
    btnGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
    btnShadow: "0 4px 14px rgba(220,38,38,0.35)",
  },
  success: {
    accentGradient: "linear-gradient(90deg, #10b981, #059669)",
    iconBg: "#ecfdf5",
    iconColor: "#059669",
    iconRing: "rgba(16,185,129,0.1)",
    btnGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    btnShadow: "0 4px 14px rgba(5,150,105,0.35)",
  },
};

export default function CustomDialog({
  open,
  title,
  message,
  variant = "info",
  confirmLabel = "OK",
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => confirmRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const v = VARIANT_MAP[variant];
  const s = VARIANT_STYLES[variant];

  const dialog = (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel?.(); }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="dialog-title"
    >
      {/* Panel */}
      <div
        className="animate-dialog-in"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 360,
          borderRadius: 24,
          overflow: "hidden",
          background: "linear-gradient(160deg, #ffffff 0%, #f9fafb 100%)",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,1)",
        }}
      >
        {/* Accent top stripe */}
        <div style={{ height: 5, background: s.accentGradient }} />

        {/* Close button */}
        {onCancel && (
          <button
            type="button"
            aria-label="Tutup"
            onClick={onCancel}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 30,
              height: 30,
              borderRadius: "50%",
              border: "none",
              background: "rgba(0,0,0,0.05)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9ca3af",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.1)"; e.currentTarget.style.color = "#4b5563"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Body */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "28px 28px 24px",
            gap: 16,
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: s.iconBg,
              color: s.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: `0 0 0 10px ${s.iconRing}`,
            }}
          >
            {v.icon}
          </div>

          {/* Text */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <h2
              id="dialog-title"
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 800,
                color: "#111827",
                lineHeight: 1.3,
              }}
            >
              {title}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#6b7280",
                lineHeight: 1.65,
              }}
            >
              {message}
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", paddingTop: 4 }}>
            <button
              ref={confirmRef}
              type="button"
              onClick={onConfirm}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 14,
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 14,
                color: "#ffffff",
                background: s.btnGradient,
                boxShadow: s.btnShadow,
                transition: "opacity 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseDown={(e) => { e.currentTarget.style.transform = "scale(0.98)"; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              {confirmLabel}
            </button>

            {cancelLabel && (
              <button
                type="button"
                onClick={onCancel}
                style={{
                  width: "100%",
                  height: 44,
                  borderRadius: 14,
                  border: "1.5px solid rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 14,
                  background: "transparent",
                  color: "#6b7280",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.color = "#374151"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#6b7280"; }}
              >
                {cancelLabel}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes dialogIn {
          from { opacity: 0; transform: scale(0.88) translateY(18px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-dialog-in {
          animation: dialogIn 0.26s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </div>
  );
  return createPortal(dialog, document.body);
}

export function useDialog() {
  const [config, setConfig] = React.useState<(DialogConfig & { open: boolean }) | null>(null);

  function showAlert(
    title: string,
    message: React.ReactNode,
    variant: DialogVariant = "info"
  ): Promise<void> {
    return new Promise((resolve) => {
      setConfig({
        open: true,
        title,
        message,
        variant,
        confirmLabel: "OK",
        onConfirm: () => { setConfig(null); resolve(); },
      });
    });
  }

  function showConfirm(
    title: string,
    message: React.ReactNode,
    opts?: {
      variant?: DialogVariant;
      confirmLabel?: string;
      cancelLabel?: string;
    }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setConfig({
        open: true,
        title,
        message,
        variant: opts?.variant ?? "warning",
        confirmLabel: opts?.confirmLabel ?? "Ya, Lanjutkan",
        cancelLabel: opts?.cancelLabel ?? "Batal",
        onConfirm: () => { setConfig(null); resolve(true); },
        onCancel: () => { setConfig(null); resolve(false); },
      });
    });
  }

  const dialogNode = config ? (
    <CustomDialog
      open={config.open}
      title={config.title}
      message={config.message}
      variant={config.variant}
      confirmLabel={config.confirmLabel}
      cancelLabel={config.cancelLabel}
      onConfirm={config.onConfirm}
      onCancel={config.onCancel}
    />
  ) : null;

  return { showAlert, showConfirm, dialogNode };
}
