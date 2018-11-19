//Creating a static cache name
const staticCache = 'memory-game-cache-v1';
let cacheFiles = [
    '/',
    '/index.html',
    '/js/app.js',
    '/manifest.json',
    '/css/app.css',
    '/img/geometry2.png',
    '/img/icon-192.png',
    '/img/icon-512.png'
]
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCache)
    .then(cache => {
      console.log('Opening Cache');
      return cache.addAll(cacheFiles);
    })
    .catch( err => {
      console.log(`The cache opening seems to have failed: ${err}`);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request).then(response => {
        if (response.status === 404) return 'Error 404';
        return response;
      });
    })
    .catch( err => {
      console.log(`There was an unexpected error : ${err}`)
    })
  );
});
