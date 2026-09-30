"use client";

import React, { useState } from "react";
import { ScheduleItem } from "@/types/schedule";

interface EditScheduleModalProps {
  isOpen: boolean;
  schedule: ScheduleItem | null;
  onClose: () => void;
  onSave: (updatedSchedule: ScheduleItem) => void;
}

export default function EditScheduleModal({ isOpen, schedule, onClose, onSave }: EditScheduleModalProps) {
  if (!isOpen || !schedule) return null;

  return (
    <EditScheduleDialog
      key={schedule.id}
      schedule={schedule}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function EditScheduleDialog({
  schedule,
  onClose,
  onSave,
}: {
  schedule: ScheduleItem;
  onClose: () => void;
  onSave: (updatedSchedule: ScheduleItem) => void;
}) {
  const [formData, setFormData] = useState<ScheduleItem>({ ...schedule });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (field: keyof ScheduleItem, value: string | number) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const n = { ...p }; delete n[field]; return n; });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    const newErrors: Record<string, string> = {};
    if (!formData.courseName.trim()) newErrors.courseName = "Nama mata kuliah wajib diisi";
    if (!formData.lecturer.trim())   newErrors.lecturer   = "Nama dosen wajib diisi";
    if (!formData.room.trim())       newErrors.room       = "Ruangan wajib diisi";
    if (!formData.startTime)         newErrors.startTime  = "Jam mulai wajib diisi";
    if (!formData.endTime)           newErrors.endTime    = "Jam selesai wajib diisi";
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setIsSubmitting(true);
    setTimeout(() => { onSave(formData); setIsSubmitting(false); onClose(); }, 320);
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    fontSize: "0.875rem",
    borderRadius: "10px",
    outline: "none",
    background: "#f8f9fc",
    color: "#111827",
    transition: "border-color 0.15s",
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    ...inputBase,
    border: errors[field] ? "1px solid #dc2626" : "1px solid #e8eaf0",
  });

  const label: React.CSSProperties = {
    display: "block",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    color: "#6b7280",
    marginBottom: "6px",
  };

  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = "#4f46e5");
  const blurBorder = (field: string) => (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = errors[field] ? "#dc2626" : "#e8eaf0");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="modal-enter w-full max-w-xl flex flex-col overflow-hidden"
        style={{
          background: "#ffffff",
          border: "1px solid #e8eaf0",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 24px rgba(0,0,0,0.08)",
          maxHeight: "90vh",
        }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid #f1f3f8" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
            >
              <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: "#111827" }}>Edit Jadwal Kuliah</h3>
              <p className="text-[11px]" style={{ color: "#9ca3af" }}>
                {formData.courseCode} · {formData.type}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
            style={{ color: "#9ca3af" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f1f3f8"; e.currentTarget.style.color = "#374151"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4">

            {/* Nama MK */}
            <div>
              <label style={label}>Nama Mata Kuliah</label>
              <input
                type="text" value={formData.courseName}
                onChange={(e) => handleChange("courseName", e.target.value)}
                style={inputStyle("courseName")}
                placeholder="Contoh: Pemrograman Web Lanjut"
                onFocus={focusBorder} onBlur={blurBorder("courseName")}
              />
              {errors.courseName && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.courseName}</p>}
            </div>

            {/* Dosen + SKS */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label style={label}>Dosen Pengampu</label>
                <input
                  type="text" value={formData.lecturer}
                  onChange={(e) => handleChange("lecturer", e.target.value)}
                  style={inputStyle("lecturer")}
                  placeholder="Nama dosen beserta gelar"
                  onFocus={focusBorder} onBlur={blurBorder("lecturer")}
                />
                {errors.lecturer && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.lecturer}</p>}
              </div>
              <div>
                <label style={label}>SKS</label>
                <select
                  value={formData.sks}
                  onChange={(e) => handleChange("sks", Number(e.target.value))}
                  style={{ ...inputStyle(""), cursor: "pointer" }}
                  onFocus={focusBorder} onBlur={blurBorder("")}
                >
                  {[1, 2, 3, 4, 6].map((n) => <option key={n} value={n}>{n} SKS</option>)}
                </select>
              </div>
            </div>

            {/* Hari + Jam */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label style={label}>Hari</label>
                <select
                  value={formData.day}
                  onChange={(e) => handleChange("day", e.target.value as ScheduleItem["day"])}
                  style={{ ...inputStyle(""), cursor: "pointer" }}
                  onFocus={focusBorder} onBlur={blurBorder("")}
                >
                  {["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"].map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={label}>Jam Mulai</label>
                <input type="time" value={formData.startTime}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  style={inputStyle("startTime")} onFocus={focusBorder} onBlur={blurBorder("startTime")} />
              </div>
              <div>
                <label style={label}>Jam Selesai</label>
                <input type="time" value={formData.endTime}
                  onChange={(e) => handleChange("endTime", e.target.value)}
                  style={inputStyle("endTime")} onFocus={focusBorder} onBlur={blurBorder("endTime")} />
              </div>
            </div>

            {/* Ruangan + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={label}>Ruangan / Lokasi</label>
                <input type="text" value={formData.room}
                  onChange={(e) => handleChange("room", e.target.value)}
                  style={inputStyle("room")}
                  placeholder="Misal: Lab Komputer 3"
                  onFocus={focusBorder} onBlur={blurBorder("room")} />
                {errors.room && <p className="text-xs mt-1" style={{ color: "#dc2626" }}>{errors.room}</p>}
              </div>
              <div>
                <label style={label}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value as ScheduleItem["status"])}
                  style={{ ...inputStyle(""), cursor: "pointer" }}
                  onFocus={focusBorder} onBlur={blurBorder("")}
                >
                  {["Akan Datang","Sedang Berlangsung","Selesai","Ditiadakan"].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Catatan */}
            <div>
              <label style={label}>Catatan (Opsional)</label>
              <textarea
                rows={2} value={formData.notes || ""}
                onChange={(e) => handleChange("notes", e.target.value)}
                style={{ ...inputStyle(""), resize: "none" }}
                placeholder="Misal: Bawa laptop, kuis bab 4..."
                onFocus={focusBorder} onBlur={blurBorder("")}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-end gap-3 mt-5 pt-4"
            style={{ borderTop: "1px solid #f1f3f8" }}
          >
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
              style={{ color: "#6b7280", background: "#f1f3f8", border: "1px solid #e8eaf0" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#e8eaf0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#f1f3f8")}
            >
              Batal
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
              style={{ background: "#4f46e5", color: "#ffffff", border: "none", boxShadow: "0 2px 8px rgba(79,70,229,0.3)" }}
              onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = "#4338ca")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#4f46e5")}
            >
              {isSubmitting ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Menyimpan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
