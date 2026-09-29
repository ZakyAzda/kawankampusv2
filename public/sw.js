// KawanKampus Service Worker for Offline PWA Support
const CACHE_NAME = "kawankampus-cache-v2";

// Core static assets guaranteed to be accessible
const CORE_STATIC_ASSETS = [
  "/offline",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  "/apple-touch-icon.png"
];

// Optional routes to pre-warm in cache if accessible
const OPTIONAL_ROUTES = [
  "/home",
  "/calendar",
  "/weekly",
  "/profile"
];

// Install Event: Cache core assets, try optional ones gracefully
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Always cache core static assets
      await cache.addAll(CORE_STATIC_ASSETS);

      // Best-effort cache for optional user routes (won't fail install if redirected to login)
      for (const route of OPTIONAL_ROUTES) {
        try {
          const res = await fetch(route);
          if (res.ok && res.status === 200) {
            await cache.put(route, res);
          }
        } catch {
          // Ignore failures for individual routes during install
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up stale caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Only handle same-origin requests or Google Fonts
  if (url.origin !== self.location.origin && !url.hostname.includes("fonts.googleapis.com") && !url.hostname.includes("fonts.gstatic.com")) {
    return;
  }

  // 1. API calls: Network-first, fallback to cache
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 2. Navigation / HTML pages: Network-first, fallback to cache, then /offline fallback
  if (event.request.mode === "navigate" || event.request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const offlinePage = await caches.match("/offline");
          if (offlinePage) {
            return offlinePage;
          }
          return new Response("Offline", { status: 503, headers: { "Content-Type": "text/plain" } });
        })
    );
    return;
  }

  // 3. Static assets (images, icons, fonts, css, js): Cache-first with stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse.ok && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
