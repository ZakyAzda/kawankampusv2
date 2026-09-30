"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone, Share } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

const DISMISS_KEY = "pwa_prompt_dismissed";
const DISMISS_MS = 3 * 24 * 60 * 60 * 1000; // 3 hari

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);

  useEffect(() => {
    // Sudah terinstal / dibuka dari home screen -> jangan tampilkan
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((window.navigator as unknown as { standalone?: boolean }).standalone);
    if (isStandalone) return;

    // Sudah ditutup baru-baru ini -> jangan tampilkan
    try {
      const dismissedTime = localStorage.getItem(DISMISS_KEY);
      if (dismissedTime && Date.now() - parseInt(dismissedTime, 10) < DISMISS_MS) {
        return;
      }
    } catch {}

    const ua = window.navigator.userAgent;
    const isIos =
      /iphone|ipad|ipod/i.test(ua) ||
      (ua.includes("Mac") && window.navigator.maxTouchPoints > 1); // iPadOS

    // iOS: tidak ada beforeinstallprompt, tampilkan panduan manual
    if (isIos) {
      const t = setTimeout(() => setPlatform("ios"), 1500);
      return () => clearTimeout(t);
    }

    // Android / Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPlatform("android");
    };

    const handleAppInstalled = () => {
      setPlatform(null);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setPlatform(null);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setPlatform(null);
    try {
      localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {}
  };

  if (!platform) return null;

  return (
    <aside
      aria-label="Install App Prompt"
      className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-surface-lowest/95 backdrop-blur-md border border-primary/20 p-4 rounded-2xl shadow-xl shadow-primary/10 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm shadow-primary/30">
          <Smartphone className="w-5 h-5 text-on-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-on-surface leading-tight">
            Pasang KawanKampus
          </h3>

          {platform === "android" ? (
            <>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Akses deteksi jadwal bentrok lebih cepat langsung dari layar utama tanpa browser.
              </p>
              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Pasang Sekarang
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container text-xs transition-colors cursor-pointer"
                >
                  Nanti Saja
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs text-secondary mt-1 leading-relaxed">
                Tambahkan ke layar utama iPhone Anda agar terbuka seperti aplikasi:
              </p>
              <ol className="text-xs text-on-surface mt-2 space-y-1.5 list-decimal list-inside leading-relaxed">
                <li>
                  Tekan tombol{" "}
                  <Share className="inline w-3.5 h-3.5 -mt-0.5 text-primary" />{" "}
                  <b>Share</b> di Safari
                </li>
                <li>
                  Pilih <b>Add to Home Screen</b>
                </li>
                <li>
                  Tekan <b>Add</b>
                </li>
              </ol>
              <div className="mt-3">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-2.5 py-1.5 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container text-xs transition-colors cursor-pointer"
                >
                  Nanti Saja
                </button>
              </div>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Tutup saran instalasi"
          className="text-outline hover:text-on-surface p-1 rounded-lg hover:bg-surface-container transition-colors -mr-1 -mt-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}