/* global self, Response */
var myName = 'service-turtle';
console.log(myName, 'startup');

self.addEventListener('install', function () {
  console.log(myName, 'installed');
});

self.addEventListener('activate', function () {
  console.log(myName, 'activated');
});

var mocks;

self.addEventListener('fetch', function (event) {
  console.log(myName, 'fetch', event);

  mocks = mocks || {};

  Object.keys(mocks).forEach(function (url) {
    var urlReg = new RegExp(url);
    if (urlReg.test(event.request.url)) {
      var mockData = mocks[url];
      var options = mockData.options || {};
      var response = new Response(mockData.data, {
        status: mockData.code,
        responseText: mockData.data
      });

      if (options.timeout) {

        event.respondWith(new Promise(function (resolve) {
          setTimeout(function () {
            resolve(response);
          }, options.timeout);
        }));

      } else {
        event.respondWith(response);
      }
    }
  });

});

// use window.navigator.serviceWorker.controller.postMessage('hi')
// to communicate with this service worker
self.onmessage = function onMessage(event) {
  console.log('message to service worker', event.data);

  if (event.data === 'clear') {
    mocks = {};
    return;
  }

  if (event.data.url) {
    console.log('registering mock response for url', event.data.url);

    mocks = mocks || {};
    mocks[event.data.url] = event.data;
  }
};
