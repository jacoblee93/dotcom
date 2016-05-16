module.exports = (() => {

  'use strict';

  const Dotcom = require('dotcom');
  const daemon = new Dotcom.Daemon();

  const DummyInitializer = Dotcom.require('initializers/dummy_initializer.js');

  daemon.initializers.use(DummyInitializer);

  return daemon;

})();
