const CACHE_NAME = 'defect-app-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME));
});