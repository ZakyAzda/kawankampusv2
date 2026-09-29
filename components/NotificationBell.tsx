"use client";

import React, { useEffect, useState, useRef } from "react";
import { Bell, CheckCheck, AlertTriangle, BellOff, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  async function fetchNotifications() {
    try {
      setLoading(true);
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotifications();
    // Poll every 60 seconds for new notifications
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function markAllRead() {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // silent fail
    }
  }

  async function markOneRead(id: string) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      // silent fail
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} hari lalu`;
  }

  function getTypeIcon(type: string) {
    if (type === "collision") return <AlertTriangle size={14} className="text-amber-500 shrink-0 mt-0.5" />;
    return <Bell size={14} className="text-blue-500 shrink-0 mt-0.5" />;
  }

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        type="button"
        aria-label={`Pemberitahuan${unreadCount > 0 ? `, ${unreadCount} belum dibaca` : ""}`}
        onClick={() => setIsOpen((o) => !o)}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary relative"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              minWidth: 18,
              height: 18,
              borderRadius: 9,
              background: "#EF4444",
              color: "#fff",
              fontSize: 10,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "0 4px",
              lineHeight: 1,
              border: "2px solid var(--color-surface, #fff)",
            }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 360,
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            zIndex: 100,
            overflow: "hidden",
            maxHeight: 480,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 18px 12px",
              borderBottom: "1px solid #F3F4F6",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={16} style={{ color: "#1A56DB" }} />
              <span style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>Notifikasi</span>
              {unreadCount > 0 && (
                <span
                  style={{
                    background: "#EF4444",
                    color: "#fff",
                    fontSize: 10,
                    fontWeight: 800,
                    padding: "1px 6px",
                    borderRadius: 10,
                  }}
                >
                  {unreadCount} baru
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#1A56DB",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px 8px",
                  borderRadius: 6,
                }}
              >
                <CheckCheck size={12} />
                Tandai semua
              </button>
            )}
          </div>

          {/* Notification List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading && notifications.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center", color: "#9CA3AF", fontSize: 13 }}>
                Memuat...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <BellOff size={32} style={{ margin: "0 auto 10px", color: "#D1D5DB" }} />
                <p style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 600 }}>Belum ada notifikasi</p>
                <p style={{ fontSize: 12, color: "#D1D5DB", marginTop: 4 }}>
                  Notifikasi bentrokan jadwal akan muncul di sini
                </p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markOneRead(notif.id)}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "13px 18px",
                    borderBottom: "1px solid #F9FAFB",
                    background: notif.isRead ? "#fff" : "#EFF6FF",
                    cursor: notif.isRead ? "default" : "pointer",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Unread dot */}
                  <div style={{ paddingTop: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    {getTypeIcon(notif.type)}
                    {!notif.isRead && (
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          background: "#1A56DB",
                          marginTop: 2,
                        }}
                      />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: notif.isRead ? 500 : 700,
                        color: "#111827",
                        lineHeight: 1.35,
                      }}
                    >
                      {notif.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6B7280",
                        marginTop: 2,
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {notif.message}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>{formatTime(notif.createdAt)}</span>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#1A56DB",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          Lihat <ExternalLink size={10} />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{ borderTop: "1px solid #F3F4F6", padding: "10px 18px" }}>
              <button
                onClick={() => { setIsOpen(false); fetchNotifications(); }}
                style={{ fontSize: 12, color: "#6B7280", fontWeight: 600, background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "center" }}
              >
                Perbarui notifikasi
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
