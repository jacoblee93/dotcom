module.exports = (() => {

  'use strict';

  const Command = require('../command.js');

  class NewCommand extends Command {

    constructor() {

      super('s');

    }

    run(args, flags, vflags) {

      let spawn = require('cross-spawn-async');
      let child = spawn('npm',  ['start'], {stdio: 'inherit'});

      process.on('exit', function() {
        child && child.kill();
      });

    }


  }

  return NewCommand;

})();
