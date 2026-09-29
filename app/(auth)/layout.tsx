"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <div className="min-h-dvh w-full bg-[#0a0f1d] text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[130px] animate-pulse-glow" style={{ animationDelay: "6s" }} />

        {/* Subtle grid mesh overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px"
          }}
        />
      </div>

      {/* Modern Top Header (Unified Container Alignment) */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#0a0f1d]/80 border-b border-white/[0.08]">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand (Aligned with Left Column Hero) */}
          <Link 
            href="/" 
            className="flex items-center gap-3 group rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 p-[1.5px] shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0d1424] rounded-[10px] flex items-center justify-center">
                <Radar className="w-5 h-5 text-blue-400 group-hover:rotate-45 transition-transform duration-500" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="font-extrabold text-[18px] tracking-normal text-white group-hover:text-blue-300 transition-colors">
                KawanKampus
              </span>
              <span className="text-[11px] text-slate-400 -mt-0.5 tracking-normal">
                Radar Bentrok Jadwal
              </span>
            </div>
          </Link>

          {/* Right Header Navigation / Switcher (Aligned with Right Column Card) */}
          <nav aria-label="Navigasi Autentikasi" className="flex items-center gap-3">
            <div className="flex items-center p-1 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[13px] font-semibold">
              <Link
                href="/login"
                className={`min-h-[38px] px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  isLoginPage
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className={`min-h-[38px] px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
                  !isLoginPage
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Daftar
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Container: Centered Vertically with unified max-w-6xl container */}
      <main className="flex-1 flex items-center justify-center relative z-10 w-full min-h-[calc(100dvh-4rem-4.5rem)] py-8 lg:py-12">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Minimalist Responsive Footer (Unified Container Alignment) */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#070b14]/70 backdrop-blur-md py-6 text-xs text-slate-400">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 KawanKampus. Solusi Cerdas Jadwal Mahasiswa Indonesia.</p>
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Enkripsi Aman &amp; Terverifikasi Kampus</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
