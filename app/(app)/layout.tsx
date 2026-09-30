import React from "react";
import AppNav from "@/components/AppNav";
import PageWrapper from "@/components/PageWrapper";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-surface text-on-surface">
      {/* Universal Navigation: Desktop Sticky TopBar & Mobile Fixed Bottom Bar */}
      <AppNav />

      {/* Main Content Area (padding-bottom ensures bottom tab bar doesn't obscure content on mobile) */}
      <main className="flex-1 w-full mx-auto max-w-6xl px-4 md:px-6 lg:px-8 pt-4 md:pt-8 pb-24 md:pb-10">
        <PageWrapper>{children}</PageWrapper>
      </main>
    </div>
  );
}

