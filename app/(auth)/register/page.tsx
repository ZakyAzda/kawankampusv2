"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Radar, 
  User, 
  School, 
  BookOpen, 
  Hash, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Layers
} from "lucide-react";

const POPULAR_UNIVERSITIES = [
  { short: "UI", full: "Universitas Indonesia" },
  { short: "ITB", full: "Institut Teknologi Bandung" },
  { short: "UGM", full: "Universitas Gadjah Mada" },
  { short: "UNAIR", full: "Universitas Airlangga" },
  { short: "ITS", full: "Institut Teknologi Sepuluh Nopember" },
  { short: "UNDIP", full: "Universitas Diponegoro" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    university: "Universitas Indonesia",
    email: "",
    nim: "",
    major: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Kata sandi dan konfirmasi kata sandi tidak cocok.");
      return;
    }
    if (form.password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (!agreed) {
      setError("Anda harus menyetujui Ketentuan Layanan terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          university: form.university,
          major: form.major,
          nim: form.nim,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Pendaftaran gagal. Periksa kembali formulir Anda.");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

        {/* LEFT COLUMN: Feature Showcase (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-bold tracking-wider w-fit mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PENDAFTARAN MAHASISWA</span>
          </div>

          <h1 className="text-4xl font-extrabold text-white tracking-tight leading-[1.18] mb-5">
            Mulai Sinkronisasi, <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              Bebas Tabrakan Waktu.
            </span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            Daftarkan akun kampus Anda dalam 1 menit. Sistem radar cerdas langsung siaga memantau seluruh jadwal kegiatan Anda.
          </p>

          {/* Benefits */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Validasi Kampus Otomatis</h4>
                <p className="text-xs text-slate-400">Mendukung universitas &amp; politeknik se-Indonesia.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Deteksi Otomatis FRS &amp; BEM</h4>
                <p className="text-xs text-slate-400">Sinkronkan jadwal dalam satu kali input.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Multi-Device PWA Sync</h4>
                <p className="text-xs text-slate-400">Sinkronisasi instan antara browser laptop dan HP.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Glassmorphism Register Form */}
        <div className="lg:col-span-7 w-full max-w-xl mx-auto">
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/[0.16] via-white/[0.06] to-transparent shadow-2xl">
            <div className="rounded-[23px] bg-[#0d1424]/90 backdrop-blur-2xl p-6 sm:p-9 flex flex-col gap-6">

              {/* Header */}
              <div className="flex flex-col">
                <div className="inline-flex lg:hidden items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-300 text-[11px] font-semibold w-fit mb-3 border border-blue-500/30">
                  <Radar className="w-3.5 h-3.5" />
                  <span>Buat Akun Baru</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Daftar Akun Mahasiswa
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Lengkapi data untuk mengaktifkan Radar Jadwal pribadi Anda.
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-snug break-words">{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                {/* Row: Nama Lengkap */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Nama Lengkap <span className="text-red-400">*</span>
                  </label>
                  <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.08] focus-within:border-blue-500 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dimas Wicaksono"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Row: Universitas + Quick Selector Chips */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Universitas / Kampus <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[11px] text-blue-400 font-medium">Pilih / Ketik</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.08] focus-within:border-blue-500 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <School className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="Ketik nama universitas"
                      value={form.university}
                      onChange={(e) => handleChange("university", e.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>

                  {/* Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-1 scrollbar-none">
                    <span className="text-[11px] text-slate-500 font-medium shrink-0">Populer:</span>
                    {POPULAR_UNIVERSITIES.map((u) => (
                      <button
                        key={u.short}
                        type="button"
                        onClick={() => handleChange("university", u.full)}
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                          form.university === u.full
                            ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/30"
                            : "bg-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.1]"
                        }`}
                      >
                        {u.short}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2 Cols: Jurusan & NIM */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Jurusan / Program Studi
                    </label>
                    <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.08] focus-within:border-blue-500 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                      <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="Teknik Informatika"
                        value={form.major}
                        onChange={(e) => handleChange("major", e.target.value)}
                        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      NIM <span className="text-slate-500 font-normal">(bisa untuk login)</span>
                    </label>
                    <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.08] focus-within:border-blue-500 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                      <Hash className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        placeholder="2106728192"
                        value={form.nim}
                        onChange={(e) => handleChange("nim", e.target.value)}
                        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Row: Email Kampus */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">
                      Email Kampus / Aktif <span className="text-red-400">*</span>
                    </label>
                    <span className="text-[11px] text-slate-400">Akses prioritas</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.08] focus-within:border-blue-500 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="nama@mahasiswa.ac.id"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* 2 Cols: Kata Sandi & Konfirmasi */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        Kata Sandi <span className="text-red-400">*</span>
                      </label>
                      <span className="text-[10px] text-slate-500">Min. 8 char</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.04] rounded-xl px-3.5 py-3 border border-white/[0.08] focus-within:border-blue-500 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none shrink-0 p-0.5"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Konfirmasi Sandi <span className="text-red-400">*</span>
                    </label>
                    <div className={`flex items-center gap-3 bg-white/[0.04] rounded-xl px-3.5 py-3 border transition-all ${
                      form.confirmPassword && form.confirmPassword !== form.password
                        ? "border-red-500/70"
                        : "border-white/[0.08] focus-within:border-blue-500 focus-within:bg-white/[0.07] focus-within:ring-2 focus-within:ring-blue-500/20"
                    }`}>
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={form.confirmPassword}
                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                        className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none shrink-0 p-0.5"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="w-4 h-4 rounded mt-0.5 accent-blue-600 bg-white/10 border-white/20 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-slate-400 select-none cursor-pointer leading-snug">
                    Saya menyetujui{" "}
                    <a href="#" className="font-semibold text-blue-400 hover:underline">Ketentuan Layanan</a>
                    {" "}dan{" "}
                    <a href="#" className="font-semibold text-blue-400 hover:underline">Kebijakan Privasi</a>
                    {" "}KawanKampus.
                  </label>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Pendaftaran...</span>
                    </>
                  ) : (
                    <>
                      <span>Daftar Akun Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Card Footer Link */}
              <div className="text-center pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-slate-400">
                  Sudah memiliki akun?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-blue-400 hover:text-blue-300 transition-colors ml-1"
                  >
                    Masuk sekarang
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
