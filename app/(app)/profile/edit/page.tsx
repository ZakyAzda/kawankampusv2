"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Hash,
  Save,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import FormField from "@/components/ui/FormField";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

/* ─── tipe & konstanta ─── */
interface ProfileForm {
  name: string;
  nim: string;
  university: string;
  major: string;
  semester: string; // disimpan sebagai string agar cocok dengan <select>
}

type FieldErrors = Partial<Record<keyof ProfileForm, string>>;

const EMPTY_FORM: ProfileForm = {
  name: "",
  nim: "",
  university: "",
  major: "",
  semester: "1",
};

const SEMESTER_OPTIONS = Array.from({ length: 14 }, (_, i) => i + 1);

/* ─── validasi (sama dengan aturan di API) ─── */
function validate(form: ProfileForm): FieldErrors {
  const e: FieldErrors = {};
  const name = form.name.trim();
  const university = form.university.trim();
  const major = form.major.trim();
  const nim = form.nim.trim();

  if (!name) e.name = "Nama wajib diisi";
  else if (name.length < 2) e.name = "Nama minimal 2 karakter";
  else if (name.length > 80) e.name = "Nama maksimal 80 karakter";

  if (nim && !/^\d{5,20}$/.test(nim)) e.nim = "NIM hanya boleh angka (5–20 digit)";

  if (!university) e.university = "Universitas wajib diisi";
  else if (university.length > 100) e.university = "Universitas maksimal 100 karakter";

  if (!major) e.major = "Jurusan wajib diisi";
  else if (major.length > 100) e.major = "Jurusan maksimal 100 karakter";

  const sem = Number(form.semester);
  if (!Number.isInteger(sem) || sem < 1 || sem > 14) e.semester = "Pilih semester 1–14";

  return e;
}

/* ─── Select field (gaya sama dengan FormField) ─── */
function SelectField({
  label,
  id,
  value,
  onChange,
  error,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={id} className="font-sans font-semibold text-[13px] md:text-[14px] text-on-surface flex items-center gap-1">
        <span>{label}</span>
        <span className="text-tertiary font-bold" aria-hidden="true">*</span>
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`w-full min-h-[48px] rounded-xl px-4 font-sans text-[16px] text-on-surface outline-none shadow-sm transition-all duration-200 cursor-pointer ${
          error
            ? "bg-error-container/20 border-2 border-error"
            : "bg-surface-container-low border border-surface-variant/80 hover:border-surface-variant focus:bg-surface-container focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      >
        {SEMESTER_OPTIONS.map((s) => (
          <option key={s} value={s}>
            Semester {s}
          </option>
        ))}
      </select>
      {error && (
        <div role="alert" className="flex items-center gap-1.5 text-[12px] font-medium text-error mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

/* ─── Judul section dalam form ─── */
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--color-secondary)" }}>
      {children}
    </p>
  );
}

/* ══════════════════════════════════════════════
   MAIN PAGE — /profile/edit
   Mobile  : 1 kolom
   Desktop : (lg) kiri = preview live (sticky), kanan = form
══════════════════════════════════════════════ */
export default function EditProfilePage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [initial, setInitial] = useState<ProfileForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ── Ambil data profil dari database ── */
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/users/me");
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        if (!res.ok) {
          setApiError("Gagal memuat data profil. Coba muat ulang halaman.");
          return;
        }
        const { user } = await res.json();
        const loaded: ProfileForm = {
          name: user.name ?? "",
          nim: user.nim ?? "",
          university: user.university ?? "",
          major: user.major ?? "",
          semester: String(user.semester ?? 1),
        };
        setEmail(user.email ?? "");
        setForm(loaded);
        setInitial(loaded);
      } catch {
        setApiError("Terjadi kesalahan jaringan. Coba lagi.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  const dirty = useMemo(
    () =>
      form.name.trim() !== initial.name.trim() ||
      form.nim.trim() !== initial.nim.trim() ||
      form.university.trim() !== initial.university.trim() ||
      form.major.trim() !== initial.major.trim() ||
      form.semester !== initial.semester,
    [form, initial]
  );

  function setField<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setApiError(null);
  }

  /* ── Simpan ke database lewat PATCH /api/users/me ── */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    setApiError(null);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          nim: form.nim.trim(), // "" → disimpan sebagai null oleh API
          university: form.university.trim(),
          major: form.major.trim(),
          semester: Number(form.semester),
        }),
      });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Gagal menyimpan perubahan");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/profile");
        router.refresh();
      }, 1200);
    } catch {
      setApiError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Preview values ── */
  const previewName = form.name.trim() || "Nama Kamu";
  const previewInitial = previewName.charAt(0).toUpperCase();

  /* ── Success state ── */
  if (success) {
    return (
      <div className="animate-fade-slide-up flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
          style={{ background: "linear-gradient(135deg, #d1fae5, #a7f3d0)", color: "#065f46" }}
        >
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Profil Berhasil Diperbarui!
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-secondary)" }}>
            Kamu akan diarahkan kembali ke profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-slide-up flex flex-col gap-5 lg:gap-8 w-full max-w-lg md:max-w-2xl lg:max-w-none mx-auto pb-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3 pt-1">
        <Link
          href="/profile"
          aria-label="Kembali ke profil"
          className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-colors active:scale-95"
          style={{ background: "var(--color-surface-container)", color: "var(--color-on-surface)" }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[11px] font-bold tracking-widest uppercase" style={{ color: "var(--color-secondary)" }}>
            Akun Mahasiswa
          </p>
          <h1 className="text-2xl lg:text-3xl font-extrabold" style={{ color: "var(--color-on-surface)" }}>
            Edit Profil
          </h1>
        </div>
      </div>

      <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[340px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)] lg:gap-8 lg:items-start">
        {/* ───────── Preview live (sticky di desktop) ───────── */}
        <aside className="lg:sticky lg:top-24">
          <div
            className="rounded-2xl p-5 lg:p-6 flex flex-col items-center text-center gap-4 relative overflow-hidden shadow-sm"
            style={{ background: "var(--color-surface-lowest)", border: "1px solid var(--color-surface-high)" }}
          >
            <div
              className="absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{ background: "var(--color-primary-fixed)" }}
            />
            <p className="text-[11px] font-bold tracking-widest uppercase relative" style={{ color: "var(--color-secondary)" }}>
              Pratinjau
            </p>

            <div
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-full shrink-0 aspect-square flex items-center justify-center text-3xl lg:text-4xl font-extrabold shadow-sm relative"
              style={{ background: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed-variant)" }}
            >
              {loading ? "" : previewInitial}
            </div>

            <div className="flex flex-col items-center min-w-0 max-w-full relative">
              <h2 className="text-lg lg:text-xl font-bold leading-tight break-words max-w-full" style={{ color: "var(--color-on-surface)" }}>
                {loading ? "Memuat..." : previewName}
              </h2>
              <p className="text-xs lg:text-sm mt-1 break-words max-w-full" style={{ color: "var(--color-on-surface-variant)" }}>
                {form.major.trim() || "Jurusan"} • {form.university.trim() || "Universitas"}
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
                {form.nim.trim() && (
                  <span
                    className="font-mono text-xs font-semibold px-2 py-0.5 rounded-md"
                    style={{ background: "var(--color-surface-low)", color: "var(--color-secondary)" }}
                  >
                    NIM {form.nim.trim()}
                  </span>
                )}
                <span
                  className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed-variant)" }}
                >
                  Semester {form.semester}
                </span>
              </div>
            </div>

            {dirty && (
              <span
                className="text-[11px] font-semibold px-3 py-1 rounded-full relative"
                style={{ background: "#fef3c7", color: "#92400e" }}
              >
                Ada perubahan yang belum disimpan
              </span>
            )}
          </div>
        </aside>

        {/* ───────── Form ───────── */}
        <div
          className="rounded-2xl overflow-hidden shadow-sm min-w-0"
          style={{ background: "var(--color-surface-lowest)", border: "1px solid var(--color-surface-high)" }}
        >
          <form onSubmit={handleSubmit} noValidate className="p-5 lg:p-8 flex flex-col gap-6">
            {apiError && (
              <div
                role="alert"
                className="rounded-xl px-4 py-3 text-sm font-semibold flex items-start gap-2"
                style={{ background: "#fff0f0", border: "1px solid #fecaca", color: "#dc2626" }}
              >
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Informasi Pribadi */}
            <div className="flex flex-col gap-4">
              <SectionTitle>Informasi Pribadi</SectionTitle>

              <FormField
                label="Nama Lengkap"
                name="name"
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                placeholder="Nama sesuai KTM"
                icon={<User className="w-4 h-4" />}
                autoComplete="name"
                error={errors.name}
                disabled={loading}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="NIM"
                  name="nim"
                  value={form.nim}
                  onChange={(e) => setField("nim", e.target.value.replace(/\D/g, "").slice(0, 20))}
                  placeholder="Contoh: 2311082003"
                  icon={<Hash className="w-4 h-4" />}
                  error={errors.nim}
                  hint="Opsional, hanya angka"
                  disabled={loading}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  icon={<Mail className="w-4 h-4" />}
                  rightSlot={<Lock className="w-4 h-4 text-outline" />}
                  hint="Email tidak dapat diubah"
                  disabled
                />
              </div>
            </div>

            <div className="h-px -mx-5 lg:-mx-8" style={{ background: "var(--color-surface-high)" }} />

            {/* Informasi Akademik */}
            <div className="flex flex-col gap-4">
              <SectionTitle>Informasi Akademik</SectionTitle>

              <FormField
                label="Universitas"
                name="university"
                value={form.university}
                onChange={(e) => setField("university", e.target.value)}
                placeholder="Contoh: Politeknik Negeri Padang"
                icon={<GraduationCap className="w-4 h-4" />}
                error={errors.university}
                disabled={loading}
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_200px] gap-4">
                <FormField
                  label="Jurusan / Program Studi"
                  name="major"
                  value={form.major}
                  onChange={(e) => setField("major", e.target.value)}
                  placeholder="Contoh: Teknik Informatika"
                  icon={<BookOpen className="w-4 h-4" />}
                  error={errors.major}
                  disabled={loading}
                  required
                />
                <SelectField
                  label="Semester"
                  id="semester"
                  value={form.semester}
                  onChange={(v) => setField("semester", v)}
                  error={errors.semester}
                />
              </div>
            </div>

            <div className="h-px -mx-5 lg:-mx-8" style={{ background: "var(--color-surface-high)" }} />

            {/* Aksi */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <SecondaryButton
                type="button"
                onClick={() => router.push("/profile")}
                disabled={submitting}
                className="sm:min-w-[120px]"
              >
                Batal
              </SecondaryButton>
              <PrimaryButton
                type="submit"
                icon={Save}
                loading={submitting}
                disabled={loading || !dirty}
                className="sm:min-w-[200px]"
              >
                Simpan Perubahan
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}