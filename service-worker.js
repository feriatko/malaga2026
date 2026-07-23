const CACHE='dovolenka-costa-v7';
const CORE=[
'./','./index.html','./prakticke.html','./jedlo.html','./miesta.html','./program.html','./assets/style.css','./assets/app.js','./manifest.webmanifest',
'./assets/icon-192.png','./assets/icon-512.png',
'./assets/images/hero.jpg','./assets/images/marina.jpg','./assets/images/park.jpg',
'./assets/images/colomares.jpg','./assets/images/cathedral.jpg','./assets/images/santiago.jpg',
'./assets/images/alcazaba.jpg','./assets/images/atarazanas.jpg','./assets/images/muelle.jpg',
'./assets/images/virgen-pena.jpg','./assets/images/mijas-church.jpg'
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||!['http:','https:'].includes(u.protocol)) return;
  e.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(resp=>{
    if(resp.ok&&u.origin===self.location.origin)caches.open(CACHE).then(c=>c.put(r,resp.clone()));
    return resp;
  }).catch(()=>r.mode==='navigate'?caches.match('./index.html'):undefined)));
});
