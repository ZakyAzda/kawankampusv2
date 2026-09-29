"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, BookOpen, Users, Layers, AlertTriangle, ShieldCheck, RefreshCw } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  nim?: string | null;
  university?: string | null;
  major?: string | null;
  semester?: number | null;
  createdAt: string;
  scheduleCount: number;
  conflictCount: number;
  unresolvedConflicts: number;
  schedulesByCategory: Record<string, number>;
}

const CATEGORY_META = [
  { key: "kuliah", label: "Mata Kuliah Reguler & Praktikum", color: "#1A56DB", bg: "#EBF0FD", icon: BookOpen },
  { key: "organisasi", label: "Kegiatan Organisasi & Kepanitiaan", color: "#7C3AED", bg: "#EDE9FE", icon: Users },
  { key: "lainnya", label: "Aktivitas Pribadi & Lainnya", color: "#059669", bg: "#D1FAE5", icon: Layers },
];

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/me");
        if (res.status === 401) {
          router.replace("/login");
          return;
        }
        if (!res.ok) throw new Error("Gagal memuat profil");
        const data = await res.json();
        setUser(data.user);
      } catch (err: any) {
        setError(err.message || "Gagal memuat profil");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 300 }}>
        <RefreshCw size={24} style={{ color: "#1A56DB", animation: "spin 1s linear infinite" }} />
        <span style={{ marginLeft: 10, color: "#6B7280", fontSize: 14 }}>Memuat profil...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div style={{ textAlign: "center", padding: "60px 24px" }}>
        <AlertTriangle size={40} color="#EF4444" style={{ margin: "0 auto 12px" }} />
        <p style={{ color: "#EF4444", fontWeight: 600 }}>{error || "Profil tidak ditemukan"}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ marginTop: 16, padding: "8px 20px", background: "#1A56DB", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const totalSchedules = user.scheduleCount;
  const safeSchedules = Math.max(0, totalSchedules - (user.unresolvedConflicts * 2 > totalSchedules ? totalSchedules : user.unresolvedConflicts));
  const memberSince = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(user.createdAt));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* 2-Column Desktop Profile Layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "360px 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* Left Column: Profile Card */}
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
          }}
        >
          {/* Header background */}
          <div
            style={{
              height: 110,
              background: "linear-gradient(135deg, #1A56DB 0%, #1440A8 100%)",
              position: "relative",
            }}
          />

          {/* Profile details */}
          <div style={{ padding: "0 24px 28px", textAlign: "center", position: "relative" }}>
            {/* Avatar */}
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "#FFFFFF",
                border: "4px solid #FFFFFF",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "-40px auto 14px",
                fontSize: 32,
                fontWeight: 800,
                color: "#1A56DB",
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : <User size={32} />}
            </div>

            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827" }}>{user.name}</h2>
            {user.nim && (
              <p style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>NIM: {user.nim}</p>
            )}
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{user.email}</p>

            <div
              style={{
                display: "inline-block",
                marginTop: 8,
                fontSize: 11,
                fontWeight: 700,
                color: "#065F46",
                background: "#ECFDF5",
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              Mahasiswa Aktif
            </div>

            {/* Academic Details */}
            <div
              style={{
                marginTop: 24,
                borderTop: "1px solid #F3F4F6",
                paddingTop: 18,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {[
                { label: "Universitas", value: user.university || "-" },
                { label: "Program Studi", value: user.major || "-" },
                { label: "Semester", value: user.semester ? `Semester ${user.semester}` : "-" },
                { label: "Email", value: user.email },
                { label: "Bergabung", value: memberSince },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}
                >
                  <span style={{ color: "#6B7280" }}>{item.label}</span>
                  <span style={{ fontWeight: 600, color: "#111827", maxWidth: 180, textAlign: "right", wordBreak: "break-word" }}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{
                marginTop: 24,
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "10px 0",
                background: loggingOut ? "#F3F4F6" : "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: 10,
                color: loggingOut ? "#9CA3AF" : "#DC2626",
                fontWeight: 700,
                fontSize: 14,
                cursor: loggingOut ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {loggingOut ? (
                <RefreshCw size={16} style={{ animation: "spin 1s linear infinite" }} />
              ) : (
                <LogOut size={16} />
              )}
              {loggingOut ? "Keluar..." : "Keluar dari Akun"}
            </button>
          </div>
        </div>

        {/* Right Column: Statistics & Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Key Metrics Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "20px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Total Jadwal</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginTop: 8 }}>
                {totalSchedules}
              </div>
              <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Agenda aktif terdaftar</div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "20px",
                border: "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Jadwal Aman</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#10B981", marginTop: 8 }}>
                {safeSchedules}
              </div>
              <div style={{ fontSize: 12, color: "#059669", marginTop: 2 }}>Tanpa bentrokan waktu</div>
            </div>

            <div
              style={{
                background: "#FFFFFF",
                borderRadius: 14,
                padding: "20px",
                border: user.unresolvedConflicts > 0 ? "1px solid #FECACA" : "1px solid #E5E7EB",
              }}
            >
              <div style={{ fontSize: 13, color: "#6B7280", fontWeight: 600 }}>Konflik Aktif</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: user.unresolvedConflicts > 0 ? "#EF4444" : "#10B981",
                  marginTop: 8,
                }}
              >
                {user.unresolvedConflicts}
              </div>
              <div style={{ fontSize: 12, color: user.unresolvedConflicts > 0 ? "#DC2626" : "#059669", marginTop: 2 }}>
                {user.unresolvedConflicts > 0 ? "Perlu penyelesaian" : "Jadwal optimal"}
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid #E5E7EB",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 18 }}>
              Rincian Kategori Jadwal
            </h3>

            {totalSchedules === 0 ? (
              <p style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center", padding: "24px 0" }}>
                Belum ada jadwal yang terdaftar.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {CATEGORY_META.map((cat) => {
                  const count = user.schedulesByCategory[cat.key] || 0;
                  const pct = totalSchedules ? Math.round((count / totalSchedules) * 100) : 0;
                  return (
                    <div key={cat.key}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: "#374151" }}>{cat.label}</span>
                        <span style={{ fontWeight: 700, color: "#111827" }}>
                          {count} Jadwal ({pct}%)
                        </span>
                      </div>
                      <div style={{ height: 10, borderRadius: 5, background: "#F3F4F6", overflow: "hidden" }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: cat.color,
                            borderRadius: 5,
                            transition: "width 0.6s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Collision Radar System Info */}
          <div
            style={{
              background: "#FFFFFF",
              borderRadius: 16,
              border: "1px solid #E5E7EB",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
            }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
              Status Mesin Collision Radar
            </h3>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>
              Algoritma pendeteksi bentrokan waktu berjalan di server menggunakan Prisma + MongoDB Atlas.
              Sistem secara otomatis mengevaluasi interval waktu setiap kali jadwal ditambahkan atau diperbarui.
            </p>

            <div
              style={{
                marginTop: 16,
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#F9FAFB",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Engine Status</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#059669", marginTop: 2 }}>
                  ● Aktif (Server-Side Detection)
                </div>
              </div>

              <div
                style={{
                  background: "#F9FAFB",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Total Konflik Tercatat</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginTop: 2 }}>
                  {user.conflictCount} Konflik
                </div>
              </div>

              <div
                style={{
                  background: user.unresolvedConflicts > 0 ? "#FEF2F2" : "#F0FDF4",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: user.unresolvedConflicts > 0 ? "1px solid #FECACA" : "1px solid #BBF7D0",
                }}
              >
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Belum Diselesaikan</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: user.unresolvedConflicts > 0 ? "#DC2626" : "#059669", marginTop: 2 }}>
                  {user.unresolvedConflicts > 0 ? `${user.unresolvedConflicts} Konflik Aktif` : "Semua Terselesaikan"}
                </div>
              </div>

              <div
                style={{
                  background: "#F9FAFB",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid #E5E7EB",
                }}
              >
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>Toleransi Waktu</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginTop: 2 }}>
                  0 Menit (Exact Interval Overlap)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
