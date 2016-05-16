module.exports = (function() {

  'use strict';

  /* Forces HTTPS */

  class ForceHTTPSMiddleware {

    exec(controller, callback) {

      let headers = controller._requestHeaders;
      let host = headers.host || '';

      if (headers.hasOwnProperty('x-forwarded-proto') &&
          headers['x-forwarded-proto'] !== 'https') {
        controller.redirect(`https://${host}${controller._path}`);
        return;
      }

      callback(null);

    }

  }

  return ForceHTTPSMiddleware;

})();
