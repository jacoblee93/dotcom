module.exports = (function() {

  'use strict';

  class CORSMiddleware {

    exec(controller, callback) {

      controller.allowOrigin('*');
      controller.appendHeader('Access-Control-Allow-Headers', 'Authorization');
      callback(null);

    }

  }

  return CORSMiddleware;

})();
