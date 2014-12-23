(function registerTurtle(root) {

  if (!navigator) {
    console.error('Missing navigator');
    return;
  }

  if (!navigator.serviceWorker) {
    console.error('Sorry, not ServiceWorker feature, maybe enable it?');
    console.error('http://jakearchibald.com/2014/using-serviceworker-today/');
  }

  function getCurrentScriptFolder() {
    var scriptEls = document.getElementsByTagName( 'script' );
    var thisScriptEl = scriptEls[scriptEls.length - 1];
    var scriptPath = thisScriptEl.src;
    return scriptPath.substr(0, scriptPath.lastIndexOf( '/' ) + 1 );
  }

  var scriptFolder = getCurrentScriptFolder();

  navigator.serviceWorker.register(scriptFolder + 'service-turtle.js').then(function () {
    console.log('Caught service turtle, use `turtle` object to mock responses');

    root.turtle = {
      clear: function () {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage('clear');
          console.log('turtle has cleared mocks');
        }
      },
      get: function (url, options) {
        if (navigator.serviceWorker && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            method: 'get',
            url: url,
            options: options
          });
        } else {
          console.error('service worker not found, maybe reload?');
        }
      }
    };

  }, function (err) {
    console.error('no luck loading service worker', err);
  });

}(window));
