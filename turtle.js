(function registerTurtle(root) {

  if (!navigator) {
    console.error('Missing navigator');
    return;
  }

  if (!navigator.serviceWorker) {
    console.error('Sorry, not ServiceWorker feature, maybe enable it?');
    console.error('http://jakearchibald.com/2014/using-serviceworker-today/');
    return;
  }

  function la(condition) {
    if (!condition) {
      var args = Array.prototype.slice.call(arguments, 1)
        .map(JSON.stringify);
      throw new Error(args.join(' '));
    }
  }

  function isFunction(f) {
    return typeof f === 'function';
  }

  function isString(f) {
    return typeof f === 'string';
  }

  function isUnemptyString(s) {
    return isString(s) && s;
  }

  function getCurrentScriptFolder() {
    var scriptEls = document.getElementsByTagName( 'script' );
    var thisScriptEl = scriptEls[scriptEls.length - 1];
    var scriptPath = thisScriptEl.src;
    return scriptPath.substr(0, scriptPath.lastIndexOf( '/' ) + 1 );
  }

  // read service worker script url from config or determine from the current script
  var serviceScriptUrl = typeof root.serviceTurtleConfig === 'undefined' ?
    getCurrentScriptFolder() + 'service-turtle.js' : root.serviceTurtleConfig.serviceScriptUrl;

  function registeredWorker(registration) {
    la(registration, 'missing service worker registration');
    la(registration.active, 'missing active service worker');
    la(isFunction(registration.active.postMessage),
      'expected function postMessage to communicate with service worker');

    var send = registration.active.postMessage.bind(registration.active);
    console.log('Have a service-turtle, use `turtle` object to mock responses');

    root.turtle = {
      clear: function () {
        send('clear');
        console.log('turtle has cleared mocks');
      },
      get: function (url, options) {
        la(isUnemptyString(url), 'expected url pattern', url);
        la(options && options.code, 'expected at least return code', options);

        send({
          method: 'get',
          url: url,
          options: options
        });
      }
    };
  }

  function onError(err) {
    console.error('turtle error', err);
  }

  navigator.serviceWorker.register(serviceScriptUrl)
    .then(registeredWorker)
    .catch(onError);

}(window));
