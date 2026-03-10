const CACHE_NAME='tacmap-v1';
const TILE_CACHE='tacmap-tiles-v1';
const APP_SHELL=['./','/index.html','/manifest.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(APP_SHELL).catch(()=>{})));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME&&k!==TILE_CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
const url=e.request.url;
if(url.includes('tile.openstreetmap.org')){e.respondWith(caches.open(TILE_CACHE).then(cache=>cache.match(e.request).then(cached=>{if(cached)return cached;return fetch(e.request,{mode:'cors'}).then(response=>{if(response.ok)cache.put(e.request,response.clone());return response;}).catch(()=>cached||new Response('',{status:503}));})));return;}
e.respondWith(caches.match(e.request).then(cached=>{if(cached)return cached;return fetch(e.request).then(response=>{if(response.ok){const clone=response.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,clone));}return response;}).catch(()=>{if(e.request.mode==='navigate')return caches.match('/index.html');return new Response('',{status:503});});}));
});
