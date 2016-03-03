module.exports = (() => {

  'use strict';

  const Command = require('../command.js');
  const fs = require('fs-extra');

  class NewCommand extends Command {

    constructor() {

      super('new');

    }

    run(args, flags, vflags) {

      if (!args[0]) {
        throw new Error('No name specified');
      }

      let rootDir = `${__dirname}/../..`;
      let outputDir = `${process.cwd()}/${args[0]}`;

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      } else {
        throw new Error(`Directory "${outputDir}" already exists.`)
      }

      fs.copySync(`${rootDir}/src`, outputDir);
      fs.copySync(`${rootDir}/core`, `${outputDir}/node_modules/dotcom/core`);
      fs.copySync(`${rootDir}/package.json`, `${outputDir}/node_modules/dotcom/package.json`);
      fs.copySync(`${rootDir}/node_modules`, `${outputDir}/node_modules/dotcom/node_modules`);

      console.log(`Dotcom project initialized in ${outputDir}`);

    }


  }

  return NewCommand;

})();
