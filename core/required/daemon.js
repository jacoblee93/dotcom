module.exports = (() => {

  'use strict';

  const fxn = require('fxn');

  /**
  * Multi-process HTTP Daemon that resets when files changed (in development)
  * @class
  */
  class Daemon extends fxn.Daemon {

    constructor() {

      super('Dotcom');
      this.initializers = new fxn.ExecutionQueue();

    }

    start(port) {

      this.initializers.exec((err) => {

        if (err) {
          throw err;
        }

        super.start(port);

      });

    }

  }

  return Daemon;

})();
