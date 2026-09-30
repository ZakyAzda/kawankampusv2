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
import { auth, googleProvider, isFirebaseConfigured } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    setError("");
    setIsGoogleLoading(true);

    if (!isFirebaseConfigured || !auth || !googleProvider) {
      setError("Pendaftaran Google belum dikonfigurasi (API Key Firebase belum diisi di file .env). Silakan mendaftar manual.");
      setIsGoogleLoading(false);
      return;
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fbUser.email,
          name: fbUser.displayName,
          avatar: fbUser.photoURL,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal mendaftar menggunakan Google.");
        return;
      }

      router.push("/home");
      router.refresh();
    } catch (err: any) {
      if (
        err?.code === "auth/popup-closed-by-user" || 
        err?.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      console.error("Google Sign-Up Error:", err);
      setError("Gagal melakukan autentikasi Google. Silakan coba lagi.");
    } finally {
      setIsGoogleLoading(false);
    }
  }

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

              {/* Symmetrical Divider */}
              <div className="flex items-center gap-4 my-5" aria-hidden="true">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-slate-400 font-medium tracking-normal shrink-0">
                  atau daftar dengan
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Google Sign-Up Button */}
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || isGoogleLoading}
                  className="h-12 w-full px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] active:bg-white/[0.16] text-white font-semibold text-sm tracking-normal border border-white/15 transition-all duration-200 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 cursor-pointer shadow-sm hover:border-white/30"
                >
                  {isGoogleLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-400" aria-hidden="true" />
                      <span>Menghubungkan ke Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      <span>Daftar dengan Google</span>
                    </>
                  )}
                </button>
              </div>

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
