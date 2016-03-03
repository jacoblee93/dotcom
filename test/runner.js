'use strict';

let args = [];

try {
  args = JSON.parse(process.env.npm_config_argv);
  args = args.original.slice(1);
} catch (e) {
  args = [];
}

describe('Test Suite', function() {

  const Dotcom = require('../core/module.js');

  if (args.length && args[0].indexOf('--') === 0) {

    require(`./tests/${args[0].substr(2)}.js`)(Dotcom);

  } else {

    // do nothing

  }

});
