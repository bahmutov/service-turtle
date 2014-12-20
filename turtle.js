if (navigator && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-turtle.js').then(function (reg) {
    console.log('Caught service turtle, use `turtle` object to mock responses');


    window.turtle = {
      clear: function () {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage('clear');
          console.log('turtle has cleared mocks');
        }
      },
      get: function (url, code, options) {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            method: 'get',
            url: url,
            code: code,
            options: options
          });
        } else {
          console.error('service worker not found, maybe reload?');
        }
      }
    };

  }, function(err) {
    console.error('no luck loading service worker', err);
  });
} else {
  console.error('Sorry, not ServiceWorker feature, maybe enable it?');
  console.error('http://jakearchibald.com/2014/using-serviceworker-today/');
}
