const CACHE_NAME = 'qing-journey-v6';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://i.ibb.co/dJ5nR4KM/avatar-jpg.png'
];

// Install SW
self.addEventListener('install', (event) => {
  // Skip waiting to ensure the new service worker takes over immediately
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate SW and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Claim clients immediately so the page is controlled by the SW without reload
      return self.clients.claim();
    })
  );
});

// Fetch Strategy: Network First, falling back to Cache
// 這是為了解決您提到的「無法自動刷新」問題。
// 系統會優先嘗試連網抓最新版，如果沒網路才用舊版。
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            // Update cache with new version
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});
