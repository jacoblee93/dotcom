module.exports = (function() {

  'use strict';

  const Dotcom = require('dotcom');
  const router = new Dotcom.Router();

  /* Middleware */
  /* executed *before* Controller-specific middleware */

  // const ForceWWWMiddleware = Dotcom.require('middleware/force_www_middleware.js');
  // const ForceHTTPSMiddleware = Dotcom.require('middleware/force_https_middleware.js');

  // router.middleware.use(ForceWWWMiddleware);
  // router.middleware.use(ForceHTTPSMiddleware);

  /* Renderware */
  /* executed *after* Controller-specific renderware */

  const GzipRenderware = Dotcom.require('renderware/gzip_renderware.js')

  router.renderware.use(GzipRenderware);

  /* Routes */

  const IndexController = Dotcom.require('app/controllers/index_controller.js');
  const StaticController = Dotcom.require('app/controllers/static_controller.js');
  const Error404Controller = Dotcom.require('app/controllers/error/404_controller.js');

  /* generator: begin imports */


  /* generator: end imports */

  router.route('/').use(IndexController);
  router.route('/static/*').use(StaticController);

  /* generator: begin routes */


  /* generator: end routes */

  router.route('/*').use(Error404Controller);

  return router;

})();
