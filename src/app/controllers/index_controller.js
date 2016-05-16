module.exports = (function() {

  'use strict';

  const Dotcom = require('dotcom');

  class IndexController extends Dotcom.Controller {

    get() {

      this.template(
        'layout/body.html',
        'index.html',
        {title: 'Your Dotcom Application'}
      );

    }

  }

  return IndexController;

})();
