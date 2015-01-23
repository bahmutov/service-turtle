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
  var serviceScriptUrl;
  if (root.serviceTurtleConfig && isUnemptyString(root.serviceTurtleConfig.serviceScriptUrl)) {
    serviceScriptUrl = root.serviceTurtleConfig.serviceScriptUrl;
  } else {
    serviceScriptUrl = getCurrentScriptFolder() + 'service-turtle.js';
  }

  var scope = '/';
  if (root.serviceTurtleConfig && isUnemptyString(root.serviceTurtleConfig.scope)) {
    scope = root.serviceTurtleConfig.scope;
  }

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

  /* eslint dot-notation:0 */
  navigator.serviceWorker.register(serviceScriptUrl, { scope: scope })
    .then(registeredWorker)
    ['catch'](onError);

}(window));
