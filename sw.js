const CACHE = "kontrol-raporu-v10";
const CIZIMLER = ["genel", "sase", "kapak", "besleme", "sanziman", "sensor", "motor", "motorkapak", "kayis", "hconta", "tconta", "helezon", "tambur", "yedekset"].map((n) => `./cizim-${n}.jpg`);
const FILES = ["./", "./index.html", "./ekspertiz.html", "./katalog-ucd345.js", "./cizimler-ucd345.js", "./manifest.json", "./logo.png", "./dekanter.jpg", "./icon-180.png", "./icon-192.png", "./icon-512.png", ...CIZIMLER];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

/* Önbellekten hemen yanıt ver, arka planda güncelle: çevrimdışı çalışır, yeni sürüm bir sonraki açılışta gelir. */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const hit = await c.match(e.request, { ignoreSearch: true });
      const net = fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    })
  );
});
