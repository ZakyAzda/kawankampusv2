"use client";

import React, { useState, useEffect } from "react";
import { X, Save, RefreshCw, School, Users, Layers } from "lucide-react";
import { Schedule } from "@/types/schedule";

const DAYS = [
  { key: "senin", label: "Senin" },
  { key: "selasa", label: "Selasa" },
  { key: "rabu", label: "Rabu" },
  { key: "kamis", label: "Kamis" },
  { key: "jumat", label: "Jumat" },
  { key: "sabtu", label: "Sabtu" },
  { key: "minggu", label: "Minggu" },
];

interface EditScheduleModalProps {
  isOpen: boolean;
  schedule: Schedule | null;
  onClose: () => void;
  onSaved: (updated: Schedule) => void;
}

interface FormErrors {
  name?: string;
  day?: string;
  startTime?: string;
  endTime?: string;
  timeRange?: string;
}

export default function EditScheduleModal({
  isOpen,
  schedule,
  onClose,
  onSaved,
}: EditScheduleModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("kuliah");
  const [day, setDay] = useState("senin");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("10:00");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState("wajib");
  const [lecturer, setLecturer] = useState("");
  const [sks, setSks] = useState("");
  const [role, setRole] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Populate form when schedule changes
  useEffect(() => {
    if (schedule) {
      setName(schedule.name || "");
      setCategory(schedule.category || "kuliah");
      setDay(schedule.day || "senin");
      setStartTime(schedule.startTime || "08:00");
      setEndTime(schedule.endTime || "10:00");
      setLocation(schedule.location || "");
      setNotes(schedule.notes || "");
      setPriority(schedule.priority || "wajib");
      setLecturer(schedule.lecturer || "");
      setSks(schedule.sks != null ? String(schedule.sks) : "");
      setRole(schedule.role || "");
      setErrors({});
      setApiError(null);
    }
  }, [schedule]);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Nama jadwal wajib diisi";
    if (!day) newErrors.day = "Pilih hari";
    if (!startTime) newErrors.startTime = "Jam mulai wajib diisi";
    if (!endTime) newErrors.endTime = "Jam selesai wajib diisi";
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      if (sh * 60 + sm >= eh * 60 + em) {
        newErrors.timeRange = "Jam selesai harus setelah jam mulai";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schedule || !validate()) return;

    setSubmitting(true);
    setApiError(null);

    try {
      const body: Record<string, any> = {
        name: name.trim(),
        category,
        day,
        startTime,
        endTime,
        location: location.trim() || null,
        notes: notes.trim() || null,
        priority,
      };
      if (category === "kuliah") {
        body.lecturer = lecturer.trim() || null;
        body.sks = sks ? Number(sks) : null;
      }
      if (category === "organisasi") {
        body.role = role.trim() || null;
      }

      const res = await fetch(`/api/schedules/${schedule.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "Gagal memperbarui jadwal");
        return;
      }

      onSaved(data.schedule);
      onClose();
    } catch {
      setApiError("Terjadi kesalahan jaringan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isOpen || !schedule) return null;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    fontSize: "0.875rem",
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    outline: "none",
    background: "#F9FAFB",
    color: "#111827",
    boxSizing: "border-box",
  };

  const errorInputStyle: React.CSSProperties = { ...inputStyle, border: "1px solid #EF4444", background: "#FEF2F2" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 };
  const errorTextStyle: React.CSSProperties = { fontSize: 11, color: "#EF4444", marginTop: 3 };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#FFFFFF",
          borderRadius: 20,
          width: "100%",
          maxWidth: 560,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px 16px",
            borderBottom: "1px solid #F3F4F6",
            position: "sticky",
            top: 0,
            background: "#FFFFFF",
            zIndex: 1,
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>Edit Jadwal</h2>
            <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>Perbarui informasi jadwal kamu</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid #E5E7EB", background: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={16} color="#6B7280" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* API Error */}
          {apiError && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#DC2626", fontWeight: 600 }}>
              {apiError}
            </div>
          )}

          {/* Name */}
          <div>
            <label style={labelStyle}>Nama Jadwal *</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="Contoh: Pemrograman Web, Rapat BEM..."
              style={errors.name ? errorInputStyle : inputStyle}
            />
            {errors.name && <p style={errorTextStyle}>{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Kategori</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[
                { key: "kuliah", label: "Kuliah", icon: School, color: "#1A56DB", bg: "#EBF0FD" },
                { key: "organisasi", label: "Organisasi", icon: Users, color: "#7C3AED", bg: "#EDE9FE" },
                { key: "lainnya", label: "Lainnya", icon: Layers, color: "#059669", bg: "#D1FAE5" },
              ].map((cat) => {
                const Icon = cat.icon;
                const active = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategory(cat.key)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 10,
                      border: active ? `2px solid ${cat.color}` : "2px solid #E5E7EB",
                      background: active ? cat.bg : "#F9FAFB",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    <Icon size={16} color={active ? cat.color : "#9CA3AF"} />
                    <span style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? cat.color : "#6B7280" }}>
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day */}
          <div>
            <label style={labelStyle}>Hari *</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {DAYS.map((d) => (
                <button
                  key={d.key}
                  type="button"
                  onClick={() => setDay(d.key)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    border: day === d.key ? "2px solid #1A56DB" : "1px solid #E5E7EB",
                    background: day === d.key ? "#EBF0FD" : "#F9FAFB",
                    fontSize: 12,
                    fontWeight: day === d.key ? 700 : 500,
                    color: day === d.key ? "#1A56DB" : "#6B7280",
                    cursor: "pointer",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>
            {errors.day && <p style={errorTextStyle}>{errors.day}</p>}
          </div>

          {/* Time Range */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Mulai *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => { setStartTime(e.target.value); setErrors((p) => ({ ...p, startTime: undefined, timeRange: undefined })); }}
                style={errors.startTime || errors.timeRange ? errorInputStyle : inputStyle}
              />
              {errors.startTime && <p style={errorTextStyle}>{errors.startTime}</p>}
            </div>
            <div>
              <label style={labelStyle}>Selesai *</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => { setEndTime(e.target.value); setErrors((p) => ({ ...p, endTime: undefined, timeRange: undefined })); }}
                style={errors.endTime || errors.timeRange ? errorInputStyle : inputStyle}
              />
              {errors.endTime && <p style={errorTextStyle}>{errors.endTime}</p>}
            </div>
            {errors.timeRange && (
              <div style={{ gridColumn: "1 / -1" }}>
                <p style={errorTextStyle}>{errors.timeRange}</p>
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Lokasi / Ruangan</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Gedung A Lantai 3, Zoom, dll."
              style={inputStyle}
            />
          </div>

          {/* Priority */}
          <div>
            <label style={labelStyle}>Prioritas</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["wajib", "fleksibel"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: 10,
                    border: priority === p ? (p === "wajib" ? "2px solid #EF4444" : "2px solid #F59E0B") : "2px solid #E5E7EB",
                    background: priority === p ? (p === "wajib" ? "#FEF2F2" : "#FFFBEB") : "#F9FAFB",
                    fontSize: 12,
                    fontWeight: priority === p ? 700 : 500,
                    color: priority === p ? (p === "wajib" ? "#DC2626" : "#D97706") : "#6B7280",
                    cursor: "pointer",
                    textTransform: "capitalize",
                  }}
                >
                  {p === "wajib" ? "🔴 Wajib" : "🟡 Fleksibel"}
                </button>
              ))}
            </div>
          </div>

          {/* Category-specific fields */}
          {category === "kuliah" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 80px", gap: 12 }}>
              <div>
                <label style={labelStyle}>Dosen Pengampu</label>
                <input
                  value={lecturer}
                  onChange={(e) => setLecturer(e.target.value)}
                  placeholder="Nama dosen"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>SKS</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={sks}
                  onChange={(e) => setSks(e.target.value)}
                  placeholder="3"
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {category === "organisasi" && (
            <div>
              <label style={labelStyle}>Peran / Jabatan</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Contoh: Ketua, Koordinator Divisi..."
                style={inputStyle}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label style={labelStyle}>Catatan (opsional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Tambahan info atau pengingat..."
              rows={2}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 10, paddingTop: 4 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #E5E7EB", background: "#F9FAFB", fontSize: 14, fontWeight: 600, color: "#6B7280", cursor: "pointer" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{
                flex: 2,
                padding: "10px",
                borderRadius: 10,
                border: "none",
                background: submitting ? "#9CA3AF" : "#1A56DB",
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 700,
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "background 0.15s",
              }}
            >
              {submitting ? (
                <><RefreshCw size={15} style={{ animation: "spin 1s linear infinite" }} /> Menyimpan...</>
              ) : (
                <><Save size={15} /> Simpan Perubahan</>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
