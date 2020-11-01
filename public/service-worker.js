importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');
workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/assets/fonts/material.woff2', revision: '1' },
    { url: '/css/material-icon.css', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/css/palette.css', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/db-controller.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/nav.js', revision: '1' },
    { url: '/pages/saved.html', revision: '1' },
    { url: '/pages/standings.html', revision: '1' },
    { url: '/pages/teams.html', revision: '1' },
    { url: '/icon.png', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/nav.html', revision: '1' }
]);

workbox.routing.registerRoute(
  new RegExp('https://api.football-data.org/v2/'),
  workbox.strategies.staleWhileRevalidate({
      cacheName: 'pages'
  })
);

self.addEventListener('push', function(event) {
  let body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  let options = {
    body: body,
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});
