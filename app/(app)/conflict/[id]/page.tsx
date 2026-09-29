"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RefreshCw, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";

interface Schedule {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  category: string;
  location?: string | null;
  lecturer?: string | null;
  notes?: string | null;
  priority?: string | null;
}

interface ConflictDetail {
  id: string;
  day: string;
  severity?: string | null;
  overlapStart?: string | null;
  overlapEnd?: string | null;
  status: string;
  scheduleA: Schedule;
  scheduleB: Schedule;
}

const SEVERITY_COLOR: Record<string, string> = {
  tinggi: "#EF4444",
  sedang: "#F59E0B",
  rendah: "#6B7280",
};
const SEVERITY_BG: Record<string, string> = {
  tinggi: "#FEE2E2",
  sedang: "#FEF3C7",
  rendah: "#F3F4F6",
};
const SEVERITY_LABEL: Record<string, string> = {
  tinggi: "Kritis — Harus Diselesaikan Segera",
  sedang: "Sedang — Perlu Koordinasi & Perhatian",
  rendah: "Rendah — Bisa Dikompromikan",
};
const CATEGORY_COLOR: Record<string, string> = {
  kuliah: "#1A56DB",
  organisasi: "#7C3AED",
  lainnya: "#059669",
};
const CATEGORY_BG: Record<string, string> = {
  kuliah: "#EBF0FD",
  organisasi: "#EDE9FE",
  lainnya: "#D1FAE5",
};
const DAY_LABEL: Record<string, string> = {
  senin: "Senin",
  selasa: "Selasa",
  rabu: "Rabu",
  kamis: "Kamis",
  jumat: "Jumat",
  sabtu: "Sabtu",
  minggu: "Minggu",
};

export default function ConflictDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [conflict, setConflict] = useState<ConflictDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    async function fetchConflict() {
      try {
        const res = await fetch(`/api/conflicts/${id}`);
        if (res.status === 401) { router.replace("/login"); return; }
        if (res.status === 404) { setError("Konflik tidak ditemukan"); setLoading(false); return; }
        if (!res.ok) throw new Error("Gagal memuat detail konflik");
        const data = await res.json();
        setConflict(data.conflict);
        if (data.conflict.status === "resolved") setResolved(true);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data");
      } finally {
        setLoading(false);
      }
    }
    fetchConflict();
  }, [id, router]);

  async function handleDeleteSchedule(scheduleId: string, name: string) {
    if (!confirm(`Hapus "${name}" dari jadwal untuk menyelesaikan bentrokan?`)) return;
    setDeletingId(scheduleId);
    try {
      const res = await fetch(`/api/schedules/${scheduleId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus jadwal");
      router.replace("/calendar");
    } catch (err: any) {
      alert(err.message || "Gagal menghapus jadwal");
      setDeletingId(null);
    }
  }

  async function handleMarkResolved() {
    setMarking(true);
    try {
      const res = await fetch(`/api/conflicts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" }),
      });
      if (!res.ok) throw new Error("Gagal memperbarui status");
      setResolved(true);
      if (conflict) setConflict({ ...conflict, status: "resolved" });
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui status");
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
        <RefreshCw size={24} style={{ color: "#1A56DB", animation: "spin 1s linear infinite" }} />
        <span style={{ marginLeft: 10, color: "#6B7280", fontSize: 14 }}>Memuat detail konflik...</span>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !conflict) {
    return (
      <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "60px 24px", textAlign: "center", border: "1px solid #E5E7EB", maxWidth: "600px", margin: "40px auto" }}>
        <AlertTriangle size={40} color="#EF4444" style={{ margin: "0 auto 12px" }} />
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{error || "Konflik tidak ditemukan"}</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Jadwal mungkin telah dihapus atau konflik sudah diselesaikan.</p>
        <Link href="/calendar" style={{ display: "inline-block", marginTop: 20, textDecoration: "none", fontSize: 13, fontWeight: 700, background: "#1A56DB", color: "#FFFFFF", padding: "8px 20px", borderRadius: 8 }}>
          Kembali ke Kalender
        </Link>
      </div>
    );
  }

  if (resolved) {
    return (
      <div style={{ background: "#FFFFFF", borderRadius: 16, padding: "60px 24px", textAlign: "center", border: "1px solid #E5E7EB", maxWidth: "600px", margin: "40px auto" }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <CheckCircle size={28} color="#10B981" />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Bentrokan Telah Terselesaikan!</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>Konflik antara {conflict.scheduleA.name} dan {conflict.scheduleB.name} telah ditandai selesai.</p>
        <Link href="/calendar" style={{ display: "inline-block", marginTop: 20, textDecoration: "none", fontSize: 13, fontWeight: 700, background: "#1A56DB", color: "#FFFFFF", padding: "8px 20px", borderRadius: 8 }}>
          Kembali ke Kalender
        </Link>
      </div>
    );
  }

  const { scheduleA: a, scheduleB: b } = conflict;
  const severity = conflict.severity || "sedang";
  const sevColor = SEVERITY_COLOR[severity] || "#F59E0B";
  const sevBg = SEVERITY_BG[severity] || "#FEF3C7";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Back button */}
      <div>
        <Link
          href="/calendar"
          style={{ textDecoration: "none", fontSize: 13, fontWeight: 600, color: "#6B7280", display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <ArrowLeft size={16} />
          Kembali ke Kalender
        </Link>
      </div>

      {/* Severity Alert Banner */}
      <div
        style={{
          background: sevBg,
          border: `1.5px solid ${sevColor}40`,
          borderRadius: 16,
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: sevColor, color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, color: sevColor }}>
              Tingkat Konflik: {severity.toUpperCase()}
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827", marginTop: 2 }}>
              {SEVERITY_LABEL[severity]}
            </h2>
            <p style={{ fontSize: 13, color: "#4B5563", marginTop: 2 }}>
              Hari {DAY_LABEL[conflict.day] || conflict.day}
              {conflict.overlapStart && conflict.overlapEnd && (
                <> · Interval bentrokan: <strong>{conflict.overlapStart} – {conflict.overlapEnd} WIB</strong></>
              )}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
          <span style={{ fontSize: 12, fontWeight: 700, background: "#FFFFFF", color: sevColor, padding: "8px 16px", borderRadius: 20, border: `1px solid ${sevColor}60` }}>
            Tabrakan Waktu Terdeteksi
          </span>
          {conflict.status === "unresolved" && (
            <button
              onClick={handleMarkResolved}
              disabled={marking}
              style={{ fontSize: 12, fontWeight: 700, background: "#ECFDF5", color: "#059669", padding: "8px 16px", borderRadius: 20, border: "1px solid #A7F3D0", cursor: marking ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              {marking ? <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> : <CheckCircle size={12} />}
              {marking ? "Menyimpan..." : "Tandai Selesai"}
            </button>
          )}
        </div>
      </div>

      {/* Visual Timeline Bar */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E5E7EB", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 12 }}>Visualisasi Waktu Tabrakan</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Schedule A Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", width: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</span>
            <div style={{ flex: 1, background: "#F3F4F6", height: 26, borderRadius: 6, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: "10%", width: "60%", height: "100%", background: CATEGORY_COLOR[a.category] || "#1A56DB", borderRadius: 6, color: "#FFFFFF", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                {a.startTime} – {a.endTime}
              </div>
            </div>
          </div>

          {/* Overlap indicator */}
          {conflict.overlapStart && conflict.overlapEnd && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626", width: 140 }}>Zona Konflik</span>
              <div style={{ flex: 1, background: "#F3F4F6", height: 16, borderRadius: 4, position: "relative" }}>
                <div style={{ position: "absolute", left: "40%", width: "30%", height: "100%", background: "#EF4444", borderRadius: 4, color: "#FFFFFF", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {conflict.overlapStart} – {conflict.overlapEnd}
                </div>
              </div>
            </div>
          )}

          {/* Schedule B Bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#374151", width: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</span>
            <div style={{ flex: 1, background: "#F3F4F6", height: 26, borderRadius: 6, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: "40%", width: "55%", height: "100%", background: CATEGORY_COLOR[b.category] || "#7C3AED", borderRadius: 6, color: "#FFFFFF", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                {b.startTime} – {b.endTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Schedule Comparison */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[{ label: "Jadwal A", sched: a }, { label: "Jadwal B", sched: b }].map(({ label, sched }) => (
          <div
            key={sched.id}
            style={{ background: "#FFFFFF", borderRadius: 16, border: "1.5px solid #E5E7EB", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", padding: "2px 8px", borderRadius: 20, background: CATEGORY_BG[sched.category] || "#F3F4F6", color: CATEGORY_COLOR[sched.category] || "#6B7280" }}>
                  {label} · {sched.category}
                </span>
                {sched.priority === "wajib" && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#DC2626", background: "#FEE2E2", padding: "2px 6px", borderRadius: 4 }}>Wajib</span>
                )}
              </div>

              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#111827", lineHeight: 1.3 }}>{sched.name}</h3>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", fontSize: 13 }}>
                  <span style={{ color: "#6B7280", width: 110 }}>Waktu:</span>
                  <span style={{ fontWeight: 700, color: "#111827" }}>{sched.startTime} – {sched.endTime} WIB</span>
                </div>
                <div style={{ display: "flex", fontSize: 13 }}>
                  <span style={{ color: "#6B7280", width: 110 }}>Hari:</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{DAY_LABEL[sched.day] || sched.day}</span>
                </div>
                {sched.location && (
                  <div style={{ display: "flex", fontSize: 13 }}>
                    <span style={{ color: "#6B7280", width: 110 }}>Lokasi:</span>
                    <span style={{ fontWeight: 600, color: "#374151" }}>{sched.location}</span>
                  </div>
                )}
                {sched.lecturer && (
                  <div style={{ display: "flex", fontSize: 13 }}>
                    <span style={{ color: "#6B7280", width: 110 }}>Dosen / PIC:</span>
                    <span style={{ fontWeight: 600, color: "#374151" }}>{sched.lecturer}</span>
                  </div>
                )}
                {sched.notes && (
                  <div style={{ display: "flex", fontSize: 13 }}>
                    <span style={{ color: "#6B7280", width: 110 }}>Catatan:</span>
                    <span style={{ color: "#4B5563" }}>{sched.notes}</span>
                  </div>
                )}
              </div>
            </div>

            <div style={{ marginTop: 24, borderTop: "1px solid #F3F4F6", paddingTop: 16 }}>
              <button
                onClick={() => handleDeleteSchedule(sched.id, sched.name)}
                disabled={deletingId === sched.id}
                style={{ width: "100%", background: deletingId === sched.id ? "#F3F4F6" : "#FEF2F2", border: "1px solid #FECACA", color: deletingId === sched.id ? "#9CA3AF" : "#DC2626", padding: "10px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: deletingId === sched.id ? "not-allowed" : "pointer", transition: "all 0.15s ease", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
              >
                {deletingId === sched.id ? (
                  <><RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} /> Menghapus...</>
                ) : (
                  `Hapus Jadwal Ini (${label.split(" ")[1]})`
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Resolution Suggestions */}
      <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E5E7EB", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", marginBottom: 14 }}>
          Rekomendasi Solusi Pintar (Collision Radar Advice)
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {[
            { title: "1. Pindah Kelas Paralel", desc: "Jika salah satu adalah mata kuliah wajib, tanyakan ke bagian akademik mengenai slot kelas paralel di hari lain." },
            { title: "2. Delegasi Kegiatan", desc: "Untuk kegiatan organisasi atau kepanitiaan, koordinasikan dengan wakil atau rekan divisi untuk mewakili kehadiranmu." },
            { title: "3. Izin Dispensasi Resmi", desc: "Ajukan surat dispensasi kehadiran resmi jika bentrokan disebabkan oleh penugasan kampus yang bersifat institusional." },
          ].map((item) => (
            <div key={item.title} style={{ background: "#F9FAFB", borderRadius: 12, padding: "16px", border: "1px solid #E5E7EB" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>{item.title}</div>
              <p style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
