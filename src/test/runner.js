module.exports = (() => {

  'use strict';

  process.env.NODE_ENV = 'test';

  const Dotcom = require('dotcom');
  const TestRunner = Dotcom.TestRunner;

  const router = Dotcom.require('app/router.js');

  const tests = new TestRunner('./test/tests', router);

  return describe('My Application', () => {

    tests.start(require('chai').expect);

  });

})();
