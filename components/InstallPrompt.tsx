'use client';

import { useEffect, useRef, useState } from 'react';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const DISMISS_KEY = 'pwa_install_dismissed_at';
const DISMISS_DAYS = 7; // isi 0 kalau mau muncul setiap refresh

export default function InstallPrompt() {
  const [platform, setPlatform] = useState<'android' | 'ios' | null>(null);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true;
    if (isStandalone) return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86400000) return;

    const ua = navigator.userAgent;
    const isIos =
      /iphone|ipad|ipod/i.test(ua) ||
      (ua.includes('Mac') && navigator.maxTouchPoints > 1);

    if (isIos) {
      setPlatform('ios');
      return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setPlatform('android');
    };
    const onInstalled = () => setPlatform(null);

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const close = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setPlatform(null);
  };

  const install = async () => {
    const p = deferredPrompt.current;
    if (!p) return;
    await p.prompt();
    await p.userChoice;
    deferredPrompt.current = null;
    setPlatform(null);
  };

  if (!platform) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 'calc(16px + env(safe-area-inset-bottom))',
        zIndex: 9999,
        background: '#fff',
        color: '#111',
        padding: 16,
        borderRadius: 16,
        boxShadow: '0 8px 30px rgba(0,0,0,.25)',
        fontSize: 14,
      }}
    >
      <p style={{ fontWeight: 700, marginBottom: 6 }}>
        Pasang KawanKampus di layar utama
      </p>

      {platform === 'android' ? (
        <p style={{ marginBottom: 12 }}>
          Buka lebih cepat seperti aplikasi, tanpa perlu buka browser.
        </p>
      ) : (
        <ol style={{ margin: '0 0 12px 18px', lineHeight: 1.6 }}>
          <li>Tekan tombol <b>Share</b> (kotak dengan panah ke atas) di Safari</li>
          <li>Scroll lalu pilih <b>Add to Home Screen</b></li>
          <li>Tekan <b>Add</b></li>
        </ol>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={close} style={{ padding: '8px 14px' }}>
          Nanti saja
        </button>
        {platform === 'android' && (
          <button
            onClick={install}
            style={{
              padding: '8px 14px',
              background: '#004ac6',
              color: '#fff',
              borderRadius: 8,
            }}
          >
            Install
          </button>
        )}
      </div>
    </div>
  );
}