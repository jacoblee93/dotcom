module.exports = (() => {

  'use strict';

  const fxn = require('fxn');
  
  class Application extends fxn.Application {

    constructor() {

      super('Dotcom');

    }

  }

  return Application;

})();
