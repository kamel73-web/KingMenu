// sw.js — KingMenu Service Worker v1.0
const CACHE_NAME = 'kingmenu-v1';
const SUPABASE_DOMAIN = 'vehqvqlbtotljstixklz.supabase.co';

const PRECACHE_URLS = [
  '/KingMenu/',
  '/KingMenu/index.html',
  '/KingMenu/manifest.json',
];

// ── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn('[SW] Pre-cache partial failure:', err);
      });
    })
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Supabase REST API → Network-first
  if (url.hostname === SUPABASE_DOMAIN && url.pathname.startsWith('/rest/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Supabase Storage (images) → Cache-first
  if (url.hostname === SUPABASE_DOMAIN && url.pathname.startsWith('/storage/')) {
    event.respondWith(cacheFirst(request, { maxAge: 7 * 24 * 60 * 60 }));
    return;
  }

  // Google Fonts → Cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, { maxAge: 365 * 24 * 60 * 60 }));
    return;
  }

  // App shell → Stale-while-revalidate
  if (url.pathname.startsWith('/KingMenu/') || url.hostname === self.location.hostname) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }
});

// ── Strategies ───────────────────────────────────────────────────────────────
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'Offline', offline: true }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

async function cacheFirst(request, { maxAge = 86400 } = {}) {
  const cached = await caches.match(request);
  if (cached) {
    const dateHeader = cached.headers.get('date');
    if (dateHeader) {
      const age = (Date.now() - new Date(dateHeader).getTime()) / 1000;
      if (age < maxAge) return cached;
    } else {
      return cached;
    }
  }
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    if (cached) return cached;
    throw new Error('Network and cache both failed');
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);

  return cached || (await networkPromise) || new Response('Offline', { status: 503 });
}

// ── Background sync (placeholder) ────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    console.log('[SW] Background sync: favorites');
  }
});

// ── Push notifications (placeholder) ─────────────────────────────────────────
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'KingMenu';
  const options = {
    body: data.body || 'Your meal plan is ready!',
    icon: 'https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/logo%20KM.jpg',
    badge: 'https://vehqvqlbtotljstixklz.supabase.co/storage/v1/object/public/Brand/logo%20KM.jpg',
    data: data.url || '/KingMenu/',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
