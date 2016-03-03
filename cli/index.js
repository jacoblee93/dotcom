#!/usr/bin/env node

module.exports = (() => {

  'use strict';

  const CommandLineInterface = require('./command_line_interface.js');

  const CLI = new CommandLineInterface();

  CLI.load('./commands');

  CLI.run(process.argv.slice(2));

  return true;

})();
