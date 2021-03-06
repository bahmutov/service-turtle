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

  function toString(x) {
    return typeof x === 'string' ? x : JSON.stringify(x);
  }

  function la(condition) {
    if (!condition) {
      var args = Array.prototype.slice.call(arguments, 1)
        .map(toString);
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
    var info = '\nservice-turtle - HTTP mock in-page proxy using ServiceWorker.\n' +
      'see https://github.com/bahmutov/service-turtle for details.\n' +
      'by Gleb Bahmutov @bahmutov\n\n' +
      'I have a valid service-turtle, use `turtle` object to mock responses';
    console.log(info);

    function sendMock(url, options) {
      la(isUnemptyString(url), 'expected url pattern', url);

      if (typeof options === 'number') {
        options = {
          code: options
        };
      }

      la(options && options.code, 'expected at least return code', options);

      send({
        method: 'get',
        url: url,
        options: options
      });
    }

    root.turtle = {
      clear: function () {
        send('clear');
        console.log('turtle has cleared mocks');
      },
      list: function () {
        send('list');
      },
      get: sendMock,
      post: sendMock
    };

    registration.active.onmessage = function messageFromServiceWorker(e) {
      console.log('received message from service worker', e);
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
