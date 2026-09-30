"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/* ─── Icons ─── */
function IconBack() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconEye({ off }: { off?: boolean }) {
  return off ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

/* ─── Password strength helper ─── */
interface StrengthInfo {
  score: number;  // 0–4
  label: string;
  color: string;
}

function getPasswordStrength(pw: string): StrengthInfo {
  if (!pw) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (pw.length >= 8)  score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  const map: StrengthInfo[] = [
    { score: 0, label: "", color: "transparent" },
    { score: 1, label: "Lemah", color: "#ef4444" },
    { score: 2, label: "Sedang", color: "#f97316" },
    { score: 3, label: "Cukup Kuat", color: "#eab308" },
    { score: 4, label: "Kuat", color: "#22c55e" },
    { score: 5, label: "Sangat Kuat", color: "#10b981" },
  ];
  return map[Math.min(score, 4)];
}

/* ─── Single password input field ─── */
function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  hint?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const hasError = Boolean(error);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: "var(--color-on-surface-variant)",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete="new-password"
          style={{
            width: "100%",
            padding: "12px 44px 12px 16px",
            fontSize: 15,
            borderRadius: 14,
            border: `1.5px solid ${hasError ? "#ef4444" : "var(--color-surface-high)"}`,
            background: hasError ? "#fff5f5" : "var(--color-surface-lowest)",
            color: "var(--color-on-surface)",
            outline: "none",
            fontFamily: "inherit",
            boxSizing: "border-box",
            transition: "border-color 0.15s, box-shadow 0.15s",
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = hasError ? "#ef4444" : "var(--color-primary)";
            e.currentTarget.style.boxShadow = hasError
              ? "0 0 0 3px rgba(239,68,68,0.12)"
              : "0 0 0 3px rgba(0,74,198,0.12)";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = hasError ? "#ef4444" : "var(--color-surface-high)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
        <button
          type="button"
          aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
          onClick={() => setShow((s) => !s)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-secondary)",
            padding: 4,
            lineHeight: 0,
          }}
        >
          <IconEye off={show} />
        </button>
      </div>
      {error && (
        <p style={{ fontSize: 12, color: "#ef4444", fontWeight: 600, margin: 0 }}>
          {error}
        </p>
      )}
      {hint && !error && hint}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════ */
export default function ChangePasswordPage() {
  const router = useRouter();

  const [newPassword, setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ new?: string; confirm?: string }>({});
  const [submitting, setSubmitting]       = useState(false);
  const [apiError, setApiError]           = useState<string | null>(null);
  const [success, setSuccess]             = useState(false);

  const strength = getPasswordStrength(newPassword);

  function validate(): boolean {
    const e: { new?: string; confirm?: string } = {};
    if (!newPassword)          e.new = "Password baru wajib diisi";
    else if (newPassword.length < 8) e.new = "Password minimal 8 karakter";
    if (!confirmPassword)      e.confirm = "Konfirmasi password wajib diisi";
    else if (newPassword && confirmPassword && newPassword !== confirmPassword)
      e.confirm = "Password tidak cocok";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      const res = await fetch("/api/users/me/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Gagal mengubah password");
        return;
      }

      setSuccess(true);
      // Redirect ke profile setelah 2 detik
      setTimeout(() => router.push("/profile"), 2000);
    } catch {
      setApiError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  const requirements = [
    { label: "Minimal 8 karakter", met: newPassword.length >= 8 },
    { label: "Huruf kapital (A–Z)", met: /[A-Z]/.test(newPassword) },
    { label: "Angka (0–9)",         met: /[0-9]/.test(newPassword) },
  ];

  /* ── Success state ── */
  if (success) {
    return (
      <div className="animate-fade-slide-up flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)" }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Password Berhasil Diperbarui!
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-secondary)" }}>
            Kamu akan diarahkan kembali ke profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-slide-up flex flex-col gap-6 w-full max-w-md mx-auto pb-10">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 pt-1">
        <Link
          href="/profile"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors active:scale-95"
          style={{
            background: "var(--color-surface-container)",
            color: "var(--color-on-surface)",
          }}
        >
          <IconBack />
        </Link>
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--color-secondary)" }}>
            Keamanan Akun
          </p>
          <h1 className="text-2xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Ganti Password
          </h1>
        </div>
      </div>

      {/* ── Info Card ── */}
      <div
        className="rounded-2xl p-4 flex items-start gap-3"
        style={{
          background: "var(--color-primary-fixed)",
          border: "1px solid var(--color-primary-fixed-dim)",
        }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "var(--color-surface-lowest)", color: "var(--color-primary)" }}
        >
          <IconShield />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--color-on-primary-fixed)" }}>
            Buat password yang kuat
          </p>
          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--color-on-primary-fixed-variant)" }}>
            Gunakan kombinasi huruf besar, angka, dan simbol agar akun kamu lebih aman.
          </p>
        </div>
      </div>

      {/* ── Form Card ── */}
      <div
        className="rounded-2xl overflow-hidden shadow-sm"
        style={{
          background: "var(--color-surface-lowest)",
          border: "1px solid var(--color-surface-high)",
        }}
      >
        <form onSubmit={handleSubmit} noValidate style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* API Error Banner */}
          {apiError && (
            <div
              className="rounded-xl px-4 py-3 text-sm font-semibold"
              style={{ background: "#fff0f0", border: "1px solid #fecaca", color: "#dc2626" }}
            >
              ⚠️ {apiError}
            </div>
          )}

          {/* New Password */}
          <PasswordField
            id="new-password"
            label="Password Baru"
            value={newPassword}
            onChange={(v) => { setNewPassword(v); setErrors((p) => ({ ...p, new: undefined })); }}
            placeholder="Masukkan password baru..."
            error={errors.new}
            hint={
              newPassword.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 2 }}>
                  {/* Strength bar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, borderRadius: 999, background: "var(--color-surface-high)", overflow: "hidden" }}>
                      <div
                        style={{
                          height: "100%",
                          width: `${(strength.score / 4) * 100}%`,
                          background: strength.color,
                          borderRadius: 999,
                          transition: "width 0.3s, background 0.3s",
                        }}
                      />
                    </div>
                    {strength.label && (
                      <span style={{ fontSize: 11, fontWeight: 700, color: strength.color, minWidth: 80 }}>
                        {strength.label}
                      </span>
                    )}
                  </div>
                  {/* Requirements checklist */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {requirements.map((r) => (
                      <div key={r.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: r.met ? "#22c55e" : "var(--color-surface-container)",
                            color: r.met ? "#fff" : "var(--color-secondary)",
                            flexShrink: 0,
                            transition: "background 0.2s",
                          }}
                        >
                          {r.met ? <IconCheck /> : null}
                        </span>
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: r.met ? 600 : 400,
                            color: r.met ? "#16a34a" : "var(--color-secondary)",
                            transition: "color 0.2s",
                          }}
                        >
                          {r.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            }
          />

          {/* Confirm Password */}
          <PasswordField
            id="confirm-password"
            label="Konfirmasi Password Baru"
            value={confirmPassword}
            onChange={(v) => { setConfirmPassword(v); setErrors((p) => ({ ...p, confirm: undefined })); }}
            placeholder="Ulangi password baru..."
            error={errors.confirm}
            hint={
              confirmPassword.length > 0 && !errors.confirm && newPassword === confirmPassword ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      width: 16, height: 16, borderRadius: "50%",
                      background: "#22c55e", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <IconCheck />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>
                    Password cocok!
                  </span>
                </div>
              ) : null
            }
          />

          {/* Divider */}
          <div style={{ height: 1, background: "var(--color-surface-high)", margin: "0 -24px" }} />

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <Link
              href="/profile"
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: 14,
                border: "1.5px solid var(--color-surface-high)",
                background: "var(--color-surface-low)",
                fontSize: 14,
                fontWeight: 600,
                color: "var(--color-secondary)",
                cursor: "pointer",
                textAlign: "center",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                padding: "12px",
                borderRadius: 14,
                border: "none",
                background: submitting ? "var(--color-surface-dim)" : "var(--color-primary)",
                color: submitting ? "var(--color-secondary)" : "var(--color-on-primary)",
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.2s",
              }}
            >
              {submitting ? (
                <>
                  <span style={{ animation: "spin 0.8s linear infinite", display: "inline-flex" }}>
                    <IconSpinner />
                  </span>
                  Menyimpan...
                </>
              ) : (
                <>
                  <IconLock />
                  Simpan Password Baru
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ── Tips card ── */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background: "var(--color-surface-lowest)",
          border: "1px solid var(--color-surface-high)",
        }}
      >
        <p
          className="text-[11px] font-bold tracking-widest uppercase"
          style={{ color: "var(--color-secondary)" }}
        >
          Tips Keamanan
        </p>
        {[
          "Jangan gunakan informasi pribadi seperti nama atau tanggal lahir",
          "Gunakan password berbeda untuk setiap layanan",
          "Pertimbangkan untuk menggunakan password manager",
        ].map((tip, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span
              className="text-[11px] font-bold shrink-0"
              style={{
                width: 20, height: 20,
                borderRadius: "50%",
                background: "var(--color-surface-container)",
                color: "var(--color-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {i + 1}
            </span>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-on-surface-variant)" }}>
              {tip}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
