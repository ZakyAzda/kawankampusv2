"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { WifiOff, CheckCircle2 } from "lucide-react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export default function OfflineIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (isOnline) {
      const handleOnline = () => {
        setShowReconnected(true);
        const timer = setTimeout(() => {
          setShowReconnected(false);
        }, 4000);
        return () => clearTimeout(timer);
      };

      window.addEventListener("online", handleOnline);
      return () => {
        window.removeEventListener("online", handleOnline);
      };
    }
  }, [isOnline]);

  const isOffline = !isOnline;

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

