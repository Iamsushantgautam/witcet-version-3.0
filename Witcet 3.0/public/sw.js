// Minimal Service Worker to satisfy PWA installability requirements
// This does NOT cache anything, ensuring the app behaves like a standard online website
// while still allowing the "Install" prompt to appear.

self.addEventListener('fetch', (event) => {
    // No-op fetch handler.
    // We do not call event.respondWith(), so the browser handles the request via network as normal.
    // This satisfies the "has a fetch handler" requirement for PWA installation without side effects.
});
