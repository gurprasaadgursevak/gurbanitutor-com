/* Gurbani Tutor — Service Worker.
 * Caches pages and static assets so the website works offline once visited.
 * Strategy: cache-first for /arths.tsv (large dictionary), stale-while-revalidate
 * for pages so updates land quickly while the cached copy keeps offline alive.
 */

const CACHE_VERSION = "v14";
const STATIC_CACHE = `gt-static-${CACHE_VERSION}`;
const PAGE_CACHE = `gt-pages-${CACHE_VERSION}`;

// Assets that are pre-cached on install.
const PRECACHE = [
  "/",
  "/about",
  "/arths",
  "/pothi",
  "/search",
  "/muharni",
  "/santhiya",
  "/mukhvak",
  "/granth",
  "/quiz",
  "/app-icon.png",
  "/santhiya-whatsapp-qr.jpeg",
  "/about-inspiration.jpg",
  "/manifest.webmanifest",
];

// Install: pre-cache the shell. We don't pre-cache /arths.tsv (it's 5.6 MB)
// so first install is fast; it'll get cached on first dictionary visit.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      // Use individual adds so a single failed asset doesn't break the whole install.
      Promise.all(
        PRECACHE.map((url) =>
          cache.add(url).catch((err) => console.warn("[sw] precache failed", url, err))
        )
      )
    )
  );
  self.skipWaiting();
});

// Activate: blow away old caches from previous versions.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only GETs.
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip cross-origin (YouTube embeds, Instagram, Vercel analytics, etc.).
  if (url.origin !== self.location.origin) return;

  // Skip Next.js HMR / RSC requests in dev — they should always be live.
  if (url.pathname.startsWith("/_next/")) return;

  // Big TSV datasets: stale-while-revalidate. Serve the cached copy
  // instantly (these files are 5+ MB), but always kick off a background
  // fetch so the next visit picks up any updates (e.g. dictionary
  // corrections in arths.tsv) without us bumping CACHE_VERSION.
  if (
    url.pathname === "/arths.tsv" ||
    url.pathname === "/sggs.tsv" ||
    url.pathname === "/dasam.tsv"
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        const cached = await cache.match(request);
        const networkPromise = fetch(request)
          .then((response) => {
            if (response && response.ok) {
              cache.put(request, response.clone()).catch(() => {});
            }
            return response;
          })
          .catch(() => null);
        return cached || (await networkPromise) || Response.error();
      })()
    );
    return;
  }

  // Manifest JSON files: network-first so a bani being added or relabeled
  // (e.g. Ardas getting verseCount + segments) lands instantly instead of
  // waiting for the SW cache to evict. Falls back to cache when offline.
  if (
    url.pathname === "/banis_manifest.json" ||
    url.pathname === "/manifest.webmanifest"
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(STATIC_CACHE);
        try {
          const response = await fetch(request);
          if (response && response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          const cached = await cache.match(request);
          return cached || Response.error();
        }
      })()
    );
    return;
  }

  // HTML pages: network-first with cache fallback.
  // We used to stale-while-revalidate, but that handed back yesterday's HTML
  // on every visit while the fresh page populated cache for next time. Users
  // hit the homepage, saw an old shell that referenced stale chunks, and only
  // got the new page after refreshing. Network-first guarantees the live page
  // when online; the cache still backs offline visits.
  const accept = request.headers.get("accept") || "";
  const isPage = accept.includes("text/html");
  if (isPage) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(PAGE_CACHE);
        try {
          const response = await fetch(request);
          if (response && response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          const cached = await cache.match(request);
          return cached || (await cache.match("/")) || Response.error();
        }
      })()
    );
    return;
  }

  // Default: cache-first for everything else (icons, qr, manifest).
  event.respondWith(
    caches.match(request).then(
      (cached) =>
        cached ||
        fetch(request).then((response) => {
          if (response && response.ok && response.type === "basic") {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
    )
  );
});
