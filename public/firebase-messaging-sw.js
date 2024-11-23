self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then(function (clientList) {
        const url = event.notification.data.url;

        if (!url) return;

        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          console.log("OPENWINDOW ON CLIENT");
          return clients.openWindow(url);
        }
      })
  );
});

self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
  
  event.waitUntil(
    caches.open('CareseptAppCacheV1').then(async (cache) => {
      return await cache.addAll([
        '/192x192.png',
        '/192x192(1).png',
        '/512x512.png',
        '/favicon.ico',
        '/favicon.svg',
        '/offline.html',
        '/2880x1800.png',
        '/2880x1800(1).png',
        '/662x1435.png',
        '/1024x1024.png',
        '/432x432.png',
        '/firebase-messaging-sw.js',
        'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
        'https://fonts.googleapis.com/icon?family=Material+Icons'
      ]).then(() => {
        console.log('Offline assets cached successfully');
      }).catch(error => {
        console.error('Failed to cache offline assets:', error);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service worker activating...');
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== 'CareseptAppCacheV1') {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ]),

    caches.keys().then((cacheNames) => {
      return Promise.all(
       cacheNames.map((cache) => {
        if (cache !== 'CareseptAppCacheV1') {
         // Checking if cache name is not 'v1'
         return caches.delete(cache);
        }
       })
      );
    })
  );
});

// ... existing code ...

self.addEventListener('fetch', (event) => {

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Return the response if successful
        if (response.status === 200) {
          return response;
        }
        // If response wasn't successful, throw error to trigger catch block
        throw new Error('Response not OK');
      })
      .catch(async () => {
        const cache = await caches.open('CareseptAppCacheV1');       
        // For navigation requests (HTML pages), return the offline page
        if (event.request.mode === 'navigate' || event.request.url.includes('.html') || event.request.headers.get('accept').includes('text/html')) {
          const offlineResponse = await cache.match('/offline.html');
          if (offlineResponse) {
            return offlineResponse;
          }
        }
        
        // For other requests, try to get from cache
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If nothing else works, return the error response
        return new Response('Offline content not available');
      })
  );
});