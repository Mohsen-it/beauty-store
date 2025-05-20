// Beauty Store Service Worker
const CACHE_NAME = 'beauty-store-cache-v1';
const OFFLINE_PAGE = '/offline.html';

// Resources to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
  '/manifest.json',
  '/css/app.css',
  '/js/app.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - precache static assets and offline page
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Helper function to determine if a request is for a page navigation
const isNavigationRequest = request => {
  return (
    request.mode === 'navigate' ||
    (request.method === 'GET' &&
      request.headers.get('accept').includes('text/html'))
  );
};

// Helper function to check if a URL is from the Vite dev server
const isViteDevServerRequest = url => {
  return url.hostname === '127.0.0.1' && url.port === '5173';
};

// Helper function to check if a URL is for an external resource
const isExternalResource = url => {
  // Check for common external domains
  const externalDomains = [
    'fonts.googleapis.com',
    'fonts.gstatic.com',
    'js.stripe.com'
  ];
  
  return externalDomains.some(domain => url.hostname.includes(domain));
};

// Fetch event - handle requests with appropriate caching strategies
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && !isExternalResource(url)) {
    return;
  }
  
  // Skip Vite dev server requests during development
  if (isViteDevServerRequest(url)) {
    return;
  }

  // Special handling for navigation requests (HTML pages)
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Cache the successful response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, try to return cached page
          return caches.match(request)
            .then(cachedResponse => {
              // Return cached page or offline page
              return cachedResponse || caches.match(OFFLINE_PAGE);
            });
        })
    );
    return;
  }

  // For non-HTML requests, use a "stale-while-revalidate" strategy
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        // Return cached response immediately if available
        const fetchPromise = fetch(request)
          .then(networkResponse => {
            // Update the cache with the new response
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            // If the request is for an image, you could return a default image
            if (request.destination === 'image') {
              return caches.match('/icons/placeholder.png');
            }
            throw error;
          });

        return cachedResponse || fetchPromise;
      })
  );
});

// Handle offline Google Fonts
self.addEventListener('fetch', event => {
  if (event.request.url.includes('fonts.googleapis.com') || 
      event.request.url.includes('fonts.gstatic.com')) {
    
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
  }
});

// Special handling for Stripe.js resources
self.addEventListener('fetch', event => {
  if (event.request.url.includes('js.stripe.com')) {
    // Don't cache Stripe.js resources, just try to fetch them
    // and if offline, let the request fail naturally
    return;
  }
});
