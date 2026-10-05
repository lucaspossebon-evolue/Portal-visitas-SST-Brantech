/* Portal SST — Brantech · service worker (network-first com fallback offline) */
const CACHE='brantech-portal-v1';
const CORE=['./','index.html','manifest.webmanifest','icone-portal-192.png','icone-portal-512.png','apple-touch-icon.png'];
self.addEventListener('install', e=>{ self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{}))); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>k===CACHE?null:caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  e.respondWith(
    fetch(e.request).then(res=>{
      if(res && res.status===200 && res.type==='basic'){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); }
      return res;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html')))
  );
});
