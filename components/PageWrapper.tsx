"use client";

import React from "react";
import { usePathname } from "next/navigation";

interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * PageWrapper — memberi efek fade-in + slide-up setiap kali halaman berganti.
 * Menggunakan key={pathname} sehingga React me-remount container dan
 * memicu animasi CSS secara instan dan mulus tanpa cascading renders.
 */
export default function PageWrapper({ children }: PageWrapperProps) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="w-full animate-fade-slide-up">
      {children}
    </div>
  );
}

