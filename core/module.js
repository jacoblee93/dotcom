module.exports = (function() {

  'use strict';

  const fxn = require('fxn');

  let Paths = {
    Application: './required/application.js',
    Controller: './required/controller.js',
    Daemon: './required/daemon.js',
    Router: './required/router.js',
    Template: './required/template.js'
  };

  let Load = {};

  let Module = {
    require: fxn.require,
    mime: fxn.mime
  };

  Object.defineProperties(
    Module,
    Object.keys(Paths).reduce((obj, key) => {

      obj[key] = {
        get: () => { return Load[key] || (Load[key] = require(Paths[key])); },
        enumerable: true
      };

      return obj;

    }, {})
  );

  return Module;

})();
