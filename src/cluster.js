module.exports = (() => {

  'use strict';

  const Dotcom = require('dotcom');
  const cluster = require('cluster');

  if (cluster.isMaster) {

    const daemon = Dotcom.require('app/daemon.js');
    daemon.start(process.env.PORT);

  } else {

    const app = new Dotcom.Application();
    app.listen(process.env.PORT);

  }

})();
