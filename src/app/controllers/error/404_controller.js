module.exports = (function() {

  "use strict";

  const Dotcom = require('dotcom');

  class Error404Controller extends Dotcom.Controller {

    get() {

      this.status(404);
      this.template('error/404.html', {title: '404 Error'});

    }

  }

  return Error404Controller;

})();
