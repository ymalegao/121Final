/* Service Worker*/ 

const CACHE_NAME = "phaser-react-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/src/main.js",   // Ensure this path matches the final output file
  "/src/App.js",     // Same here
  "/favicon.png",    // Also check for correct path
  "/manifest.webmanifest" // Web manifest for PWA functionality
];

// Install the Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch assets from cache or network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Activate the Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
