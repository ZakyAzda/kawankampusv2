import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Collision Radar — Deteksi Bentrokan Jadwal Mahasiswa",
  description:
    "Sistem deteksi bentrokan jadwal otomatis untuk mahasiswa. Pantau, kelola, dan selesaikan konflik jadwal kuliah, organisasi, dan kegiatan lainnya.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen" style={{ background: "#F3F4F6", fontFamily: "Inter, system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
