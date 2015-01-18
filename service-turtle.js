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

var allowJsonFromAnywhere = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json; charset=utf-8'
};

function responseFromOptions(options) {
  options = options || {};

  var responseOptions = {
    status: options.code || options.status || options.statusCode,
    headers: allowJsonFromAnywhere
  };

  var body = JSON.stringify(options.body || options.data);
  return new Response(body, responseOptions);
}

var allowJavaScriptFromAnywhere = {
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'text/javascript; charset=utf-8'
};

function javascriptResponse(src) {
  var responseOptions = {
    status: 200,
    headers: allowJavaScriptFromAnywhere
  };
  return new Response(src, responseOptions);
}

self.addEventListener('fetch', function (event) {
  console.log(myName, 'fetch', event);

  if (/foo\.js$/.test(event.request.url)) {
    event.respondWith(
      self.fetch(event.request.clone())
        .then(function (response) {
          // response has possible text / json / blob as promises
          return response.text().then(function (src) {
            console.log('original source');
            console.log(src);
            // src - original source code
            var transformedSource = 'console.log("hi there, from ServiceWorker!");';
            // construct new response with changed JavaScript source
            return javascriptResponse(transformedSource);
          });
        })
    );
    return;
  }

  mocks = mocks || {};

  Object.keys(mocks).forEach(function (url) {
    var urlReg = new RegExp(url);
    if (urlReg.test(event.request.url)) {
      var mockData = mocks[url];
      var options = mockData.options || {};

      var response = responseFromOptions(mockData.options);

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
