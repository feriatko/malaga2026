const CACHE='malaga2026-modern-v2';
const CORE=['./','./index.html','./assets/style.css','./assets/app.js','./manifest.webmanifest','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
    if(res&&res.status===200){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}
    return res;
  }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined)));
});
