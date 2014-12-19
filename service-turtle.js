var name = 'service-turtle';
console.log(name, 'startup');

self.addEventListener('install', function (event) {
  console.log(name, 'installed');
});

self.addEventListener('activate', function (event) {
  console.log(name, 'activated');
});

var mocks;

self.addEventListener('fetch', function (event) {
  console.log(name, 'fetch', event);

  mocks = mocks || {};

  Object.keys(mocks).forEach(function (url) {
    var urlReg = new RegExp(url);
    if (urlReg.test(event.request.url)) {
      var mockData = mocks[url];
      event.respondWith(new Response(mockData.data, {
        status: mockData.code,
        responseText: mockData.data
      }));
    }
  });

});

// use window.navigator.serviceWorker.controller.postMessage('hi')
// to communicate with this service worker
self.onmessage = function onMessage(event) {
  console.log('message to service worker', event.data);
  if (event.data.url) {
    console.log('registering mock response for url', event.data.url);

    mocks = mocks || {};
    mocks[event.data.url] = event.data;
  }
};
