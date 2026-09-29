"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Calendar, 
  Plus, 
  CalendarRange, 
  User, 
  Radar, 
} from "lucide-react";
import NotificationBell from "@/components/NotificationBell";

interface NavMenuItem {
  label: string;
  href: string;
  icon: typeof Home;
  matchPrefixes: string[];
}

const MENU_ITEMS: NavMenuItem[] = [
  {
    label: "Home",
    href: "/home",
    icon: Home,
    matchPrefixes: ["/", "/home"],
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: Calendar,
    matchPrefixes: ["/calendar"],
  },
  {
    label: "Weekly",
    href: "/weekly",
    icon: CalendarRange,
    matchPrefixes: ["/weekly"],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    matchPrefixes: ["/profile"],
  },
];

export default function AppNav() {
  const pathname = usePathname();

  const isItemActive = (item: NavMenuItem) => {
    if (item.href === "/home" || item.href === "/") {
      return pathname === "/" || pathname === "/home";
    }
    return item.matchPrefixes.some((prefix) => pathname.startsWith(prefix));
  };

  const isNewScheduleActive = pathname.startsWith("/schedule/new") || pathname.startsWith("/add");

  return (
    <>
      {/* ====================================================================
          DESKTOP NAVIGATION (>= 768px): Sticky Top Header
          ==================================================================== */}
      <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-surface-variant/60 hidden md:block">
        <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <Link
            href="/home"
            className="flex items-center gap-3 group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary py-1 px-1.5 -ml-1.5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Radar className="w-5 h-5 text-on-primary group-hover:rotate-45 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-sans font-bold text-[17px] text-on-surface leading-tight tracking-tight">
                KawanKampus
              </span>
              <span className="font-mono text-[11px] font-semibold text-secondary tracking-wider uppercase">
                Collision Radar
              </span>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav aria-label="Navigasi Utama Desktop" className="flex items-center gap-1.5 bg-surface-container-low/80 p-1.5 rounded-2xl border border-surface-variant/40">
            {MENU_ITEMS.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`min-h-[44px] px-4 py-2 rounded-xl text-[14px] font-medium transition-all duration-200 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    active
                      ? "bg-surface-lowest text-primary font-semibold shadow-sm"
                      : "text-secondary hover:text-on-surface hover:bg-surface-container/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-secondary"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Actions: Notifications & Tambah Jadwal CTA */}
          <div className="flex items-center gap-3">
            <NotificationBell />

            <Link
              href="/schedule/new"
              className="min-h-[44px] px-4 py-2 rounded-xl bg-primary text-on-primary text-[14px] font-semibold flex items-center gap-2 shadow-sm hover:bg-primary-container active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Jadwal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MOBILE NAVIGATION (< 768px): Fixed Bottom Tab Bar + Floating Center CTA
          ==================================================================== */}
      <nav
        aria-label="Navigasi Bawah Mobile"
        className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-surface-lowest/95 backdrop-blur-xl border-t border-surface-variant/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      >
        <div className="h-16 px-3 flex items-center justify-between max-w-md mx-auto relative">
          {/* Tab 1: Home */}
          {(() => {
            const item = MENU_ITEMS[0];
            const active = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active ? "text-primary font-bold" : "text-secondary hover:text-on-surface"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span className="text-[11px] leading-tight">{item.label}</span>
              </Link>
            );
          })()}

          {/* Tab 2: Calendar */}
          {(() => {
            const item = MENU_ITEMS[1];
            const active = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active ? "text-primary font-bold" : "text-secondary hover:text-on-surface"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span className="text-[11px] leading-tight">{item.label}</span>
              </Link>
            );
          })()}

          {/* Center Elevated Action: Tambah Jadwal (+) */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <Link
              href="/schedule/new"
              aria-label="Tambah Jadwal Baru"
              className="relative -top-5 flex flex-col items-center group focus-visible:outline-none"
            >
              <div
                className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                  isNewScheduleActive
                    ? "bg-primary-container text-on-primary ring-4 ring-primary/20 scale-105"
                    : "bg-primary text-on-primary shadow-primary/30 group-hover:scale-105"
                }`}
              >
                <Plus className="w-7 h-7 stroke-[2.5]" />
              </div>
              <span className={`text-[10px] font-semibold tracking-tight mt-1 ${isNewScheduleActive ? "text-primary font-bold" : "text-secondary"}`}>
                Tambah
              </span>
            </Link>
          </div>

          {/* Tab 3: Weekly */}
          {(() => {
            const item = MENU_ITEMS[2];
            const active = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active ? "text-primary font-bold" : "text-secondary hover:text-on-surface"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span className="text-[11px] leading-tight">{item.label}</span>
              </Link>
            );
          })()}

          {/* Tab 4: Profile */}
          {(() => {
            const item = MENU_ITEMS[3];
            const active = isItemActive(item);
            const Icon = item.icon;
            return (
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex-1 min-h-[44px] flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active ? "text-primary font-bold" : "text-secondary hover:text-on-surface"
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
                <span className="text-[11px] leading-tight">{item.label}</span>
              </Link>
            );
          })()}
        </div>
      </nav>
    </>
  );
}
