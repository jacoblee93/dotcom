module.exports = (function() {

  'use strict';

  let Dotcom = {
    Application: null,
    Daemon: null,
    Initializer: null,
    Router: null,
    Template: null,
    mocha: {
      Test: null,
      TestRunner: null
    }
  };

  /* Lazy Loading */

  let LazyDotcom = {
    mocha: {},
    require: function(filename) {
      return require(process.cwd() + '/' + filename);
    },
    env: require('./env.js')
  };

  Object.defineProperties(LazyDotcom, {
    data: {
      get: () => {
        return require(`${process.cwd()}/app/data.json`)[process.env.NODE_ENV || 'development'];
      },
      enumerable: true
    },
    Application: {
      get: function() {
        return Dotcom.Application || (Dotcom.Application = require('./required/application.js'));
      },
      enumerable: true
    },
    Daemon: {
      get: function() {
        return Dotcom.Daemon || (Dotcom.Daemon = require('./required/daemon.js'));
      },
      enumerable: true
    },
    Initializer: {
      get: function() {
        return Dotcom.Initializer || (Dotcom.Initializer = require('./required/initializer.js'));
      },
      enumerable: true
    },
    Router: {
      get: function() {
        return Dotcom.Router || (Dotcom.Router = require('./required/router.js'));
      },
      enumerable: true
    },
    Template: {
      get: function() {
        return Dotcom.Template || (Dotcom.Template = require('./required/template.js'));
      },
      enumerable: true
    }
  });

  Object.defineProperties(LazyDotcom.mocha, {
    Test: {
      get: function() {
        return Dotcom.mocha.Test || (Dotcom.mocha.Test = require('./mocha/test.js'));
      },
      enumerable: true
    },
    TestRunner: {
      get: function() {
        return Dotcom.mocha.TestRunner || (Dotcom.mocha.TestRunner = require('./mocha/test_runner.js'));
      },
      enumerable: true
    }
  });

  return LazyDotcom;

})();
