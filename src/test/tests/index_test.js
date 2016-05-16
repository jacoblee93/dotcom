module.exports = (() => {

  'use strict';

  const Dotcom = require('dotcom');

  class IndexTest extends Dotcom.Test {

    test(expect) {

      it('Should return an HTTP 200', done => {

        this.endpoint('/').get((status, headers, body, json) => {

          expect(status).to.equal(200);
          done();

        });

      });

    }

  }

  return IndexTest;

})();
