"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const TABS = [
  {
    href: "/home",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#1A56DB" : "#9CA3AF"} strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/calendar",
    label: "Kalender",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#1A56DB" : "#9CA3AF"} strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/weekly",
    label: "Mingguan",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#1A56DB" : "#9CA3AF"} strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </svg>
    ),
  },
  {
    href: "/profile",
    label: "Profil",
    icon: (active: boolean) => (
      <svg width="22" height="22" fill="none" stroke={active ? "#1A56DB" : "#9CA3AF"} strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function BottomTabNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #E5E7EB",
        height: "64px",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        maxWidth: "480px",
        margin: "0 auto",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
      }}
    >
      {/* Left 2 tabs */}
      {TABS.slice(0, 2).map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all"
            style={{ textDecoration: "none" }}
          >
            {tab.icon(active)}
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "#1A56DB" : "#9CA3AF" }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}

      {/* FAB center button */}
      <div className="flex-1 flex items-center justify-center" style={{ position: "relative", top: "-14px" }}>
        <Link href="/add">
          <div
            className="flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "28px",
              background: "linear-gradient(135deg, #1A56DB, #1440A8)",
              boxShadow: "0 4px 16px rgba(26,86,219,0.45)",
            }}
          >
            <svg width="26" height="26" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Right 2 tabs */}
      {TABS.slice(2).map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all"
            style={{ textDecoration: "none" }}
          >
            {tab.icon(active)}
            <span
              className="text-[10px] font-medium"
              style={{ color: active ? "#1A56DB" : "#9CA3AF" }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
