"use client";

import React, { useState } from "react";
import WarningCard from "@/components/WarningCard";
import ScheduleList from "@/components/ScheduleList";
import EditScheduleModal from "@/components/EditScheduleModal";
import { initialSchedules, initialWarnings } from "@/data/mockSchedule";
import { ScheduleItem, WarningAlert } from "@/types/schedule";

export default function HomePage() {
  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules);
  const [warnings, setWarnings] = useState<WarningAlert[]>(initialWarnings);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Alur Edit: buka modal form edit dengan data jadwal yang dipilih
  const handleEditSchedule = (item: ScheduleItem) => {
    setEditingSchedule(item);
    setIsEditOpen(true);
  };

  // Alur Edit: simpan perubahan dan update state secara reaktif
  const handleSaveSchedule = (updated: ScheduleItem) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );

    // Tampilkan notifikasi toast sukses
    setToastMessage(`Jadwal "${updated.courseName}" berhasil diperbarui!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Alur Dismiss Warning
  const handleDismissWarning = (id: string) => {
    setWarnings((prev) => prev.filter((w) => w.id !== id));
  };

  // Ringkasan metrik statistik perkuliahan
  const totalSks = schedules.reduce((acc, curr) => acc + (curr.sks || 0), 0);
  const ongoingCount = schedules.filter((s) => s.status === "Sedang Berlangsung").length;
  const upcomingCount = schedules.filter((s) => s.status === "Akan Datang").length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "#10B981",
            color: "#FFFFFF",
            padding: "12px 20px",
            borderRadius: 10,
            boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 13,
            fontWeight: 600,
          }}
          className="anim-scale"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {toastMessage}
        </div>
      )}

      {/* Header Dashboard Banner */}
      <div
        style={{
          background: "linear-gradient(135deg, #1A56DB 0%, #1440A8 100%)",
          borderRadius: 16,
          padding: "26px 30px",
          color: "#FFFFFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 18px rgba(26, 86, 219, 0.18)",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "3px 10px",
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            Dashboard Akademik Mahasiswa
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 800 }}>
            Jadwal Perkuliahan & Pengumuman
          </h2>
          <p style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.8)", marginTop: 4 }}>
            Kelola daftar mata kuliah, pantau notifikasi perubahan ruang, dan perbarui jadwal secara langsung.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "8px 16px",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800 }}>{schedules.length}</div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.75)" }}>Mata Kuliah</div>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              padding: "8px 16px",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800 }}>{totalSks}</div>
            <div style={{ fontSize: 11, color: "rgba(255, 255, 255, 0.75)" }}>Total SKS</div>
          </div>
        </div>
      </div>

      {/* 4 Metric Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: "16px 20px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Total Perkuliahan</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#111827", marginTop: 6 }}>
            {schedules.length} Kelas
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{totalSks} Beban SKS Semester Ini</div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: "16px 20px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Sedang Berlangsung</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#059669", marginTop: 6 }}>
            {ongoingCount} Kelas
          </div>
          <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>Kelas aktif hari ini</div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: "16px 20px",
            border: "1px solid #E5E7EB",
          }}
        >
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Akan Datang</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#4F46E5", marginTop: 6 }}>
            {upcomingCount} Kelas
          </div>
          <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>Jadwal perkuliahan berikutnya</div>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 12,
            padding: "16px 20px",
            border: warnings.length > 0 ? "1px solid #FDE68A" : "1px solid #E5E7EB",
          }}
        >
          <div style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Peringatan / Notifikasi</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: warnings.length > 0 ? "#D97706" : "#6B7280",
              marginTop: 6,
            }}
          >
            {warnings.length} Pesan
          </div>
          <div style={{ fontSize: 11, color: warnings.length > 0 ? "#B45309" : "#9CA3AF", marginTop: 2 }}>
            {warnings.length > 0 ? "Perubahan ruang & pengumuman" : "Tidak ada peringatan aktif"}
          </div>
        </div>
      </div>

      {/* FITUR 1: WARNING CARD (Kartu Peringatan & Notifikasi Perubahan Jadwal) */}
      {warnings.length > 0 && (
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: "#FEF3C7",
                  color: "#D97706",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                Peringatan Perubahan & Pengumuman Jadwal
              </h3>
            </div>
            <span style={{ fontSize: 12, color: "#6B7280" }}>
              {warnings.length} notifikasi aktif
            </span>
          </div>

          <WarningCard alerts={warnings} onDismiss={handleDismissWarning} />
        </section>
      )}

      {/* FITUR 2: DASHBOARD LIST JADWAL (Filter hari, pencarian, dan tombol edit) */}
      <section>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>
            Daftar Jadwal Perkuliahan
          </h3>
          <p style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
            Gunakan filter hari atau kolom pencarian untuk menemukan jadwal. Klik <strong>Edit Jadwal</strong> untuk mengubah rincian kuliah.
          </p>
        </div>

        <ScheduleList
          schedules={schedules}
          onEditSchedule={handleEditSchedule}
        />
      </section>

      {/* FITUR 3 & 4: EDIT FORM & ALUR UI (Modal edit form interaktif) */}
      <EditScheduleModal
        isOpen={isEditOpen}
        schedule={editingSchedule}
        onClose={() => {
          setIsEditOpen(false);
          setEditingSchedule(null);
        }}
        onSave={handleSaveSchedule}
      />
    </div>
  );
}
