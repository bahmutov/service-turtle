var name = 'service-turtle';
console.log(name, 'startup');

self.addEventListener('install', function (event) {
  console.log(name, 'installed');
});

self.addEventListener('activate', function (event) {
  console.log(name, 'activated');
});

self.addEventListener('fetch', function (event) {
  console.log(name, 'fetch', event);
  if (/some\/url/.test(event.request.url)) {
    event.respondWith(new Response("Hello world!"));
  }
});
