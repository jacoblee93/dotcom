module.exports = (() => {

  'use strict';

  const fxn = require('fxn');
  const Template = require('./template.js');

  class Controller extends fxn.Controller {

    template() {

      let names = Array.prototype.slice.call(arguments);
      let data = (typeof names[names.length - 1] === 'object' && names.pop()) || {};

      return this.render(Template.generate.apply(Template, names).render(this.params, data));

    }

  }

  return Controller;

})();
