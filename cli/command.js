module.exports = (() => {

  'use strict';

  class Command {

    constructor(commandName, subName) {

      this.name = commandName || '';
      this.sub = subName || '';

    }

    run(args, flags, vflags) {}

  }

  return Command;

})();
