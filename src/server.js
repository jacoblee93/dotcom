module.exports = (() => {

  'use strict';

  const Dotcom = require('dotcom');
  const cluster = require('cluster');

  if (cluster.isMaster) {

    const daemon = new Dotcom.Daemon();
    daemon.start(process.env.PORT);

  } else {

    const app = new Dotcom.Application();
    app.listen(process.env.PORT);

  }

})();
