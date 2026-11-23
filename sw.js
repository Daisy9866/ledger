// 내 장부 – 오프라인 캐시 (장부 데이터는 캐시하지 않고 기기 저장소에만 있음)
const CACHE = 'ledger-v10';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon2-180.png', './icon2-192.png', './icon2-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) { // 글꼴 등: 네트워크 우선, 실패 시 캐시
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request)));
    return;
  }
  // 앱 파일: 네트워크 우선(업데이트 반영), 오프라인이면 캐시
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(m => m || caches.match('./index.html'))));
});
