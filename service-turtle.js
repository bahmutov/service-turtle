var name = 'service-turtle';
console.log(name, 'startup');

self.addEventListener('install', function (event) {
  console.log(name, 'installed');
});

self.addEventListener('activate', function (event) {
  console.log(name, 'activated');
});

var mocks;

function sendResponse(event, response) {
  event.respondWith(response);
}

self.addEventListener('fetch', function (event) {
  console.log(name, 'fetch', event);

  mocks = mocks || {};

  Object.keys(mocks).forEach(function (url) {
    var urlReg = new RegExp(url);
    if (urlReg.test(event.request.url)) {
      var mockData = mocks[url];
      var options = mockData.options;
      var response = new Response(mockData.data, {
        status: mockData.code,
        responseText: mockData.data
      });

      if (options.timeout) {

        event.respondWith(new Promise(function (resolve, reject) {
          setTimeout(function () {
            resolve(response);
          }, options.timeout);
        }));

      } else {
        sendResponse(event, response);
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
