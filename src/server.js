module.exports = (() => {

  'use strict';

  const Dotcom = require('dotcom');
  const cluster = require('cluster');

  if (cluster.isMaster) {

    const daemon = new Dotcom.Daemon();
    daemon.start(Dotcom.data.port);

  } else {

    const app = new Dotcom.Application();
    app.listen(Dotcom.data.port);

  }

})();
