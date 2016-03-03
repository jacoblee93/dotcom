module.exports = (() => {

  'use strict';

  const fs = require('fs');

  const Command = require('./command.js');

  class CommandLineInterface {

    constructor() {

      this.commands = {};

    }

    parse(args) {

      let command = args.shift();
      let subCommand = '';

      if (!command) {
        throw new Error('No command specified');
      }

      if (command.indexOf(':') !== -1) {
        command = command.split(':');
        subCommand = command[1];
        command = command[0];
      }

      let curArgType = 'args';
      args = args.reduce((args, val) => {

        let newArg = false;

        ['flags', 'vflags'].forEach(argType => {

          if (val[0] === '-') {

            val = val.substr(1);
            curArgType = argType;
            newArg = true;

          }

        });

        newArg && args[curArgType].push([val]);

        if (!newArg) {
          if (curArgType === 'args') {
             args[curArgType].push(val);
          } else {
            args[curArgType][args[curArgType].length - 1].push(val);
          }
        }

        return args;

      }, {
        commandName: command,
        subName: subCommand,
        args: [],
        flags: [],
        vflags: []
      });

      ['flags', 'vflags'].forEach(argType => {

        args[argType] = args[argType].reduce((obj, arr) => {

          obj[arr[0]] = arr.slice(1);
          return obj;

        }, {});

      });

      return args;

    }

    load(dir) {

      fs.readdirSync([__dirname, dir].join('/')).forEach(filename => {

        if (filename.indexOf('.') === 0) {
          return;
        }

        let path = [dir, filename].join('/');

        let stat = fs.statSync([__dirname, path].join('/'));

        if (stat.isDirectory()) {

          this.load(path);

        } else {

          this.add(require(path));

        }

      });

    }

    add(CommandConstructor) {

      if (!(Command.isPrototypeOf(CommandConstructor))) {
        throw new Error('Not a valid command');
      }

      let command = new CommandConstructor();

      this.commands[this.format(command.name, command.sub)] = command;

    }

    format(name, subName) {

      return [name, subName].filter(v => v).join(':');

    }

    run(args) {

      args = this.parse(args);

      let command = this.commands[this.format(args.commandName, args.subName)];

      if (!command) {
        throw new Error(`Command "${this.format(args.commandName, args.subName)}" does not exist.`);
      }

      return command.run(args.args, args.flags, args.vflags);

    }

  }

  return CommandLineInterface;

})();
