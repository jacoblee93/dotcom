module.exports = (() => {

  'use strict';

  const url = require('url');
  const querystring = require('querystring');
  const mime = require('mime-types');
  const domain = require('domain'); // TODO: Will be deprecated
  const crypto = require('crypto');
  const fs = require('fs-extra');

  const utilities = require('./utilities.js');
  const ExecutionQueue = require('./execution_queue.js');
  const Template = require('./template.js');

  class Route {

    constructor(path, regex, names, templates, data) {

      this.path = path;
      this.regex = regex;
      this.names = names;
      this.templates = templates;
      this.data = data;

    }

    match(path) {

      let match = path.match(this.regex);
      return match ? [].slice.call(match, 1) : null;

    }

    params(path) {

      let matches = this.match(path).map(v => v || '');
      return this.names.reduce((obj, name, i) => {
        obj[name] = matches[i];
        return obj;
      }, {});

    }

  }

  class Router {

    constructor() {

      this._routes = [];
      this.middleware = new ExecutionQueue();
      this.renderware = new ExecutionQueue();

    }

    parsePath(requrl) {

      let urlData = url.parse(requrl, true);
      let path = urlData.pathname;
      if (path[path.length - 1] === '/') {
        path = path.substr(path, path.length - 1);
      }

      return path;

    }

    route(path, templates, data) {

      let routeData = utilities.parseRegexFromString(path);
      let route = new Route(path, routeData.regex, routeData.names, templates, data);
      this._routes.push(route);
      return route;

    }

    find(url) {

      let path = this.parsePath(url);
      let routes = this._routes;

      for (let i = 0, len = routes.length; i < len; i++) {
        let route = routes[i];
        if (route.match(path)) {
          return route;
        }
      }

      return null;

    }

    parseQueryParameters(query) {

      let obj = {};

      Object.keys(query).forEach(function(key) {

        let newKey, subKey;
        let value = query[key];
        let match = key.match(/(.*)\[(.*)\]$/);

        if (match) {

          newKey = match[1];
          subKey = match[2];

          if (subKey) {
            obj[newKey] = obj[newKey] || {};
            obj[newKey][subKey] = value;
            return;
          }

          value = !(value instanceof Array) ? [value] : value;

          obj[newKey] = value;
          return;

        }

        obj[key] = value;
        return;

      });

      return obj;

    }

    prepare(ip, url, method, headers, body) {

      let path = this.parsePath(url);
      let route = this.find(url);
      body = body instanceof Buffer ? body : new Buffer(body + '');

      return {
        remoteAddress: ip,
        url: url,
        method: method,
        path: path,
        headers: headers,
        matches: route.match(path),
        route: route.params(path),
        body: body,
        templates: route.templates,
        data: route.data
      };

    }

    dispatch(routeData, responder) {

      let params = {
        query: this.parseQueryParameters(url.parse(routeData.url, true).query),
        path: routeData.path,
        matches: routeData.matches,
        route: routeData.route,
        remoteAddress: routeData.headers['x-forwarded-for'] || routeData.remoteAddress,
        id: routeData.route.id
      };

      let d = domain.create();

      d.on('error', responder);

      d.run(() => {

        responder(
          null,
          200,
          {'Content-Type': 'text/html'},
          Template
            .generate.apply(Template, routeData.templates)
            .render(params, routeData.data)
        );

      });

    }

    dispatchStatic(filepath, responder) {

      let ext = filepath.substr(filepath.lastIndexOf('.') + 1);
      filepath = filepath.replace(/(\.){1,2}\//gi, '');

      let headers = {};
      let status = 200;

      fs.readFile(`./static/${filepath}`, (err, buffer) => {

        if (err) {
          return responder(null, 404, {'Content-Type': 'text/plain'}, 'File not found');
        }

        headers['Content-Type'] = mime.lookup(ext) || 'application/octet-stream';

        if (headers['Content-Type'].split(';')[0].split('/')[0] === 'video') {

          let range = this.params.headers.range;
          let len = buffer.byteLength;

          if (range) {

            range = range
              .replace('bytes=', '')
              .split('-')
              .map(v => parseInt(v))
              .filter(v => !isNaN(v))

            if (!range.length) {
              range = [0];
            }

            if (range.length === 1) {
              range.push(len - 1);
            }

            buffer = buffer.slice(range[0], range[1] + 1);

          } else {

            range = [0, len - 1];

          }

          status = 206;
          headers['Content-Range'] = `bytes ${range[0]}-${range[1]}/${len}`;
          headers['Accept-Ranges'] = 'bytes';
          headers['Content-Length'] = buffer.byteLength;

        } else {

          headers['Cache-Control'] = 'max-age=60';
          headers['ETag'] = crypto.createHash('md5').update(buffer.toString()).digest('hex');

        }

        responder(null, status, headers, buffer);

      });

    }

  }

  return Router;

})();
