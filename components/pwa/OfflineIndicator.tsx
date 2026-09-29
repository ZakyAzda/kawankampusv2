"use client";

import { useEffect, useState } from "react";
import { WifiOff, CheckCircle2 } from "lucide-react";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check initial status
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => {
        setShowReconnected(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !showReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none"
    >
      {isOffline && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/90 text-on-secondary-container backdrop-blur-md border border-secondary/20 shadow-lg text-xs font-semibold">
          <WifiOff className="w-3.5 h-3.5 text-tertiary" />
          <span>Anda sedang dalam mode offline</span>
        </div>
      )}

      {showReconnected && !isOffline && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-600 text-white backdrop-blur-md shadow-lg text-xs font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Koneksi internet terhubung kembali</span>
        </div>
      )}
    </div>
  );
}
