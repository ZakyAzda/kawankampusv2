"use client";

import Link from "next/link";
import { WifiOff, RotateCcw, Home } from "lucide-react";

export default function OfflinePage() {
  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-surface text-on-surface">
      <div className="max-w-md w-full text-center space-y-6 bg-surface-lowest p-8 rounded-3xl border border-surface-variant/50 shadow-xl shadow-primary/5">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-secondary-container/60 text-primary flex items-center justify-center shadow-inner">
          <WifiOff className="w-10 h-10 text-primary animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Kamu Sedang Offline
          </h1>
          <p className="text-sm text-secondary leading-relaxed">
            Koneksi internet tidak terdeteksi. Beberapa data mungkin belum termuat, namun jadwal yang telah tersimpan tetap bisa diakses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleReload}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-medium text-sm hover:opacity-95 transition-opacity active:scale-[0.98] cursor-pointer shadow-sm shadow-primary/25"
          >
            <RotateCcw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/home"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-container text-on-surface font-medium text-sm hover:bg-surface-high transition-colors"
          >
            <Home className="w-4 h-4" />
            Ke Beranda
          </Link>
        </div>

        <p className="text-xs text-outline pt-2">
          KawanKampus — Collision Radar Offline Mode
        </p>
      </div>
    </main>
  );
}
