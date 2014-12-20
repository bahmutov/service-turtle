if (navigator && navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-turtle.js').then(function (reg) {
    console.log('Caught service turtle, use `turtle` object to mock responses');


    window.turtle = {
      get: function (url, code) {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            method: 'get',
            url: url,
            code: code
          });
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
