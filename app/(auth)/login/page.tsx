"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Radar, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CalendarCheck, 
  BellRing, 
  Zap, 
  School
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrNim, setEmailOrNim] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrNim, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Email/NIM atau kata sandi tidak cocok.");
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
    <div className="w-full">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* ====================================================================
            LEFT COLUMN: Hero & Feature Cards
            ==================================================================== */}
        <section aria-labelledby="hero-heading" className="hidden lg:flex flex-col justify-center">
          
          {/* Subtle Ambient Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold tracking-normal w-fit shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" aria-hidden="true" />
            <span>RADAR JADWAL MAHASISWA</span>
          </div>

          {/* Heading 1 (4/8 Spacing: h1 -> p = mt-4) */}
          <h1 
            id="hero-heading"
            className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.18] mt-4 text-balance"
          >
            Satu Layar Pintar, <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-sky-400 bg-clip-text text-transparent">
              Bebas Tabrakan Jadwal.
            </span>
          </h1>

          {/* Paragraph (Contrast: text-slate-300 ~10.8:1, leading 1.6) */}
          <p className="text-slate-300 text-[15px] sm:text-base leading-relaxed tracking-normal max-w-lg mt-4">
            KawanKampus memindai jadwal kuliah KRS, jadwal praktikum lab, dan agenda organisasi secara otomatis untuk mencegah bentrok waktu sebelum terjadi.
          </p>

          {/* Feature Cards Container (4/8 Spacing: p -> cards = mt-8, gap-3) */}
          <div className="space-y-3 mt-8 max-w-lg" role="list" aria-label="Keunggulan KawanKampus">
            
            {/* Card 1 */}
            <div 
              role="listitem"
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start gap-4 hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Zap className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 pr-2">
                <h2 className="text-[15px] font-semibold text-white tracking-normal">
                  Deteksi Bentrok Instan
                </h2>
                {/* Contrast: text-slate-400 ~5.4:1, passes WCAG AA */}
                <p className="text-sm text-slate-400 leading-normal tracking-normal mt-0.5">
                  Algoritma otomatis memindai irisan waktu hingga satuan menit.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div 
              role="listitem"
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start gap-4 hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <CalendarCheck className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 pr-2">
                <h2 className="text-[15px] font-semibold text-white tracking-normal">
                  Sinkronisasi Fleksibel (PWA)
                </h2>
                <p className="text-sm text-slate-400 leading-normal tracking-normal mt-0.5">
                  Gunakan di laptop atau pasang di smartphone layaknya aplikasi resmi.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div 
              role="listitem"
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-start gap-4 hover:bg-white/[0.06] transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <BellRing className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="flex-1 pr-2">
                <h2 className="text-[15px] font-semibold text-white tracking-normal">
                  Notifikasi Pengingat Cerdas
                </h2>
                <p className="text-sm text-slate-400 leading-normal tracking-normal mt-0.5">
                  Pemberitahuan dini sebelum jadwal kuliah atau rapat dimulai.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ====================================================================
            RIGHT COLUMN: Login Form Card
            ==================================================================== */}
        <section aria-labelledby="login-card-heading" className="w-full max-w-md mx-auto lg:mr-0">
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-white/[0.14] via-white/[0.06] to-transparent shadow-2xl shadow-blue-950/40">
            
            {/* Card Content with p-6 sm:p-8 padding */}
            <div className="rounded-[23px] bg-slate-900/75 backdrop-blur-2xl p-6 sm:p-8 flex flex-col border border-white/[0.08]">

              {/* Card Header Branding (Clean Radar Icon without meaningless dot) */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 mb-3">
                  <Radar className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                
                <h2 
                  id="login-card-heading"
                  className="text-2xl font-bold text-white tracking-tight"
                >
                  Masuk ke Akunmu
                </h2>
                <p className="text-sm text-slate-300 tracking-normal mt-1 max-w-[280px]">
                  Kelola jadwal kuliah dan organisasi tanpa bentrok waktu.
                </p>
              </div>

              {/* Global Error Banner */}
              {error && (
                <div 
                  role="alert"
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium mt-5"
                >
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="leading-snug break-words">{error}</span>
                </div>
              )}

              {/* Main Login Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6" noValidate>
                
                {/* Field 1: Email / NIM */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="emailOrNim"
                    className="text-xs font-semibold text-slate-300 tracking-normal"
                  >
                    Email Kampus atau NIM
                  </label>
                  <div className="relative flex items-center">
                    <Mail 
                      className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" 
                      aria-hidden="true" 
                    />
                    <input
                      id="emailOrNim"
                      name="emailOrNim"
                      type="text"
                      autoComplete="username"
                      required
                      placeholder="nama@mahasiswa.ac.id / NIM"
                      value={emailOrNim}
                      onChange={(e) => setEmailOrNim(e.target.value)}
                      aria-invalid={error ? "true" : "false"}
                      aria-describedby={error ? "email-error" : undefined}
                      className={`h-12 w-full pl-11 pr-4 rounded-xl bg-white/[0.05] text-sm text-slate-100 placeholder:text-slate-400 tracking-normal border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        error ? "border-red-500/80" : "border-white/10 hover:border-white/20"
                      }`}
                    />
                  </div>
                  {error && (
                    <span id="email-error" className="sr-only" role="alert">
                      {error}
                    </span>
                  )}
                </div>

                {/* Field 2: Password (Width strictly identical to Email field) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-xs font-semibold text-slate-300 tracking-normal"
                    >
                      Kata Sandi
                    </label>
                    <Link
                      href="#"
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm transition-colors"
                    >
                      Lupa Sandi?
                    </Link>
                  </div>
                  <div className="relative flex items-center">
                    <Lock 
                      className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" 
                      aria-hidden="true" 
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      aria-invalid={error ? "true" : "false"}
                      className={`h-12 w-full pl-11 pr-11 rounded-xl bg-white/[0.05] text-sm text-slate-100 placeholder:text-slate-400 tracking-normal border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        error ? "border-red-500/80" : "border-white/10 hover:border-white/20"
                      }`}
                    />
                    {/* Toggle Button Positioned Absolutely INSIDE the Input */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                      aria-pressed={showPassword}
                      className="absolute right-2 w-9 h-9 flex items-center justify-center text-slate-400 hover:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Action Button (Height 48px, accessible focus ring & loading state) */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.99] text-white font-semibold text-[15px] shadow-lg shadow-blue-600/25 transition-all duration-200 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      <span>Memverifikasi Akun...</span>
                    </>
                  ) : (
                    <>
                      <span>Masuk Sekarang</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* Clean Symmetrical Divider */}
              <div className="flex items-center gap-4 my-6" aria-hidden="true">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-slate-400 font-medium tracking-normal shrink-0">
                  atau masuk dengan
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* SSO Kampus & Google Buttons (Height 44px min, 12px gap, contrast checked) */}
              <div className="space-y-3">
                <button
                  type="button"
                  disabled={isLoading}
                  className="h-11 w-full px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] text-slate-200 font-semibold text-xs sm:text-[13px] tracking-normal border border-white/15 transition-all duration-200 flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 cursor-pointer"
                >
                  <School className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                  <span>Single Sign-On (SSO Kampus)</span>
                </button>

                <button
                  type="button"
                  disabled={isLoading}
                  className="h-11 w-full px-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] active:bg-white/[0.15] text-slate-200 font-semibold text-xs sm:text-[13px] tracking-normal border border-white/15 transition-all duration-200 flex items-center justify-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-50 cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Akun Google Kampus</span>
                </button>
              </div>

              {/* Card Footer Link */}
              <div className="text-center pt-5 mt-4 border-t border-white/[0.08]">
                <p className="text-xs sm:text-[13px] text-slate-300 tracking-normal">
                  Belum punya akun?{" "}
                  <Link
                    href="/register"
                    className="font-bold text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm transition-colors ml-1"
                  >
                    Daftar di sini
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
