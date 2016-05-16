module.exports = (() => {

  'use strict';

  const Command = require('cmnd').Command;

  const fs = require('fs-extra');
  const path = require('path');
  const inquirer = require('inquirer');
  const colors = require('colors/safe');
  const async = require('async');
  const http = require('http');

  class NewCommand extends Command {

    constructor() {

      super('new');

    }

    help() {

      return {
        description: 'Initialize the current directory as a new Dotcom project'
      };

    }

    run(args, flags, vflags, callback) {

      if (fs.existsSync('./.dotcom')) {
        return callback(new Error('Dotcom project already exists in this directory'));
      }

      const rootPath = path.resolve(__dirname);
      const version = require('../../package.json').version;

      console.log('');
      console.log(`Welcome to ${colors.bold.green('Dotcom! v' + version)}`);
      console.log('');

      let data = {
        name: args[0] ? (args[0] + '').replace(/_/g, ' ') : '',
        author: (vflags.author || '').replace(/_/g, ' ') || '',
        ignoreOutput: vflags.hasOwnProperty('ignore-output')
      };

      let questions = [];

      !data.name && questions.push({
        name: 'name',
        type: 'input',
        default: 'my-dotcom-project',
        message: 'Name',
      });

      !data.author && questions.push({
        name: 'author',
        type: 'input',
        default: 'mysterious author',
        message: 'Author',
      });

      // Count new projects being made. :)
      let req = http.request({host: 'api.polybit.com', port: 80, path: `/v1/dotcom_initializations?version=${version}`, method: 'POST'});
      req.on('error', () => {});
      req.end();

      inquirer.prompt(questions, (promptResult) => {

        promptResult.name = promptResult.name || data.name;
        promptResult.author = promptResult.author || data.author;

        promptResult.simpleName = promptResult.name.replace(/\s/gi, '-');

        promptResult.version = version;

        let dirname = promptResult.name.replace(/[^A-Za-z0-9-_]/gi, '-').toLowerCase();

        console.log('Creating directory "' + dirname + '"...');
        console.log('');

        if (fs.existsSync('./' + dirname)) {
          callback(new Error('Directory "' + dirname + '" already exists, try a different project name'));
        }

        fs.mkdirSync('./' + dirname);

        console.log('Copying Dotcom directory structure and files...');
        console.log('');

        fs.copy(rootPath + '/../../src', './' + dirname, function(err) {

          if (err) return callback(err);

          let dot = require('dot');

          dot.templateSettings.strip = false;
          dot.templateSettings.varname = 'data';

          fs.writeFileSync('./' + dirname + '/.env', 'PORT=9000\n');

          fs.writeFileSync('./' + dirname + '/package.json', dot.template(
            fs.readFileSync(rootPath + '/../templates/package.json.jst').toString()
          )(promptResult));

          fs.writeFileSync('./' + dirname + '/README.md', dot.template(
            fs.readFileSync(rootPath + '/../templates/README.md.jst').toString()
          )(promptResult));

          let copyNodeModules = [
            'cli',
            'core',
            'test',
            'node_modules',
            'package.json'
          ];

          async.series(
            copyNodeModules.map(m => {
              return (callback) => {

                console.log(`Copying ${m}...`);
                fs.copy(
                  path.join(rootPath, '..', '..', m),
                  path.join(process.cwd(), dirname, 'node_modules', 'dotcom', m),
                  callback
                );

              };
            }),
            (err) => {

              if (err) {
                callback(err);
              }

              if (!data.ignoreOutput) {
                console.log('');
                console.log(colors.bold.green('All done!'));
                console.log('');
                console.log('Your new Dotcom project, ' + colors.bold(promptResult.name) + ', is ready to go! :)');
                console.log('');
                console.log('Have fun ' + promptResult.author + ', and check out https://github.com/poly/dotcom for the most up-to-date Dotcom information')
                console.log('');
                console.log(colors.bold('Pro tip: ') + 'You can try running your server right away with:');
                console.log('');
                console.log('  cd ' + dirname + ' && dotcom s');
                console.log('');
              }

              callback(null);

            }
          );

        });

      });

    }

  }

  return NewCommand;

})();
