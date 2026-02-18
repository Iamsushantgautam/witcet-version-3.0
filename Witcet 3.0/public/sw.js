// Minimal Service Worker to satisfy PWA installability requirements
// This does NOT cache anything, ensuring the app behaves like a standard online website
// while still allowing the "Install" prompt to appear.

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(err => {
            // Return a fallback response to prevent "Uncaught (in promise)" errors
            // This allows the app to handle the 404/error gracefully instead of crashing the SW logic
            return new Response('Network error occurred', {
                status: 408,
                statusText: 'Network Error'
            });
        })
    );
});
