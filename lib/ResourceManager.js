const path = require('path');
const util = require('./util');
const pluralize = require('pluralize');

/**
 * Default options
 * @type {object}
 */
const defaults = {
  baseRoute: '/',
  controllersCase: 'camel',
  controllersDir: undefined,
  controllersSuffix: 'controller',
  controllerMethods: {
    // /resource entrance handlers
    entrance: {
      get: 'index', post: 'store'
    },
    // /resource/:resource_id handlers
    item: {
      get: 'show', put: 'update', patch: 'patch', delete: 'destroy'
    }
  },
  routes: {},
  router: null,
};


class ResourceManager {
    /**
     * @param {object} options - the passed parameters
     * @prop {string} options.baseRoute = '/' - the base route
     * @prop {string} options.controllersCase = 'camel' - the case of controller files
     * @prop {string} options.controllersSuffix = 'controller' - the case of the controller files
     * @prop {string} options.controllersDir - parent directory of controllers
     * @prop {object|array} options.routes
     * @prop {string} options.router - any router that has get, post, delete and other methods for HTTP verbs
     * @prop {object} controllerMethods - An object that used for transalating verbs to correponding object' methods
     */
    constructor(options) {
        this._router = options.router;
        this._routes = [];
        this._missingHandlers = [];
        /**
         * The valid cases for controller names
         * @type {Array}
         */
        const validFileCases = ['camel', 'snake', 'pascal'];
        this.options = Object.assign({}, defaults, options);
        if ( this.options.controllersSuffix.length ) {
          this.options._hasSuffix = true;
        }
        /**
         * Check validity of controller files' case
         */
        if ( !validFileCases.includes(this.options.controllersCase) ) {
            throw new Error("Controller case must be 'camel', 'snake' or 'pascal'!");
        }
        /**
         * Define a handler for resolving controllers' filename
         * @type {Function}
         */
        this._resolveFileCase = util[this.options.controllersCase];
        this._setup();
    }

    /**
     * Set up
     * the `_parent` property is used for settings other routes by using
     * the #addRoutes method
     */
    _setup() {
        this._parent = {
          routeEntry: this.options.baseRoute,
          routeItem: this.options.baseRoute,
          dir: this.options.controllersDir,
          parentDir: this.options.controllersDir,
        }
        this._parseRoutes(this._parent, this.options.baseRoute, this.options.routes);
    }

    /**
     * Parse routes and bind HTTP verb handlers
     * @param {object} parent - parent resource
     * @param {string} parent.routeEntry - @exmaple: '/resource'
     * @param {string} parent.routeItem - @exmaple: '/resource/:resource_id'
     * @param {string} parent.dir - directory path of parent controller files
     * @param {string} parent.parentDir - directory path of parent's parent controller
     *
     * @param {string} routeName - name of the resource
     * @param {object|string|array} any - the route property's value
     */
    _parseRoutes(parent, routeName, any) {
        if ( util.isObject(any) ) {
          Object.keys(any).forEach((route) => {
            if ( util.isString(any[route]) ) {
              return this._bindSpecialRoutes(parent, {[route]: any[route]});
            }
            let _parent = this._bindResource(parent, route);
            this._parseRoutes(_parent, route, any[route]);
          });
        }

        if ( util.isArray(any) ) {
          any.forEach((resource) => {
            if ( util.isObject(resource) ) {
              return this._parseRoutes(parent, routeName, resource);
            } else if ( util.isString(resource) ) {
              this._bindResource(parent, resource);
            }
          });
        }
    }

    _bindRoute({ verb, route, controller, method }) {
        this._routes.push(arguments[0]);
        this._router[verb](route, controller.file[method]);
    }

    /**
     * Binding resource handlers by mapping HTTP verbs to object's methods
     * @param {object} parent - parent route
     * @param {string} resourceName - name of the resource
     * @return {object} - resource as parent for the next posssible routes
     */
    _bindResource(parent, resourceName) {
      let singularName = pluralize.singular(resourceName);
      let controllerDir = path.join(parent.dir, resourceName);
      let controller = this._getController(parent.dir, resourceName);
      let resourceEntry = this._concatURL(parent.routeItem, resourceName);
      let resourceItem = `${resourceEntry}/:${singularName}_id`;
      this.__bindResourceMethods(resourceEntry, controller, false);
      this.__bindResourceMethods(resourceItem, controller, true);
      return {
        dir: controllerDir,
        parentDir: parent.dir,
        routeItem: resourceItem,
        routeEntry: resourceEntry,
        routeName: resourceName,
        controller,
      };
    }

    /**
     * Add controllers by mapping http verbs
     * to the corresponding controller methods
     * @param {string} route - resource, .../resource/(:resource_id)
     * @param {object} controller - controller file
     * @param {boolean} itemRoutes - should it consider item or entry route?
     */
    __bindResourceMethods(route, controller, itemRoutes = true) {
      let methods = this.options.controllerMethods[itemRoutes ? 'item' : 'entrance'];
      Object.keys(methods).forEach(method => {
          let methodName = methods[method];
          let _route = { verb: method, route, controller, method: methodName };
          if ( controller.file[methodName] ) {
            this._bindRoute(_route);
          } else {
            this._missingHandlers.push(_route);
          }
      });
    }

    /**
     * Bind special routes,
     * special routes, are routes that are added
     * by using { string: string } syntax
     * @example { 'GET /foo': 'indexController@foo' } - `foo` is added to `indexController`
     * @example { 'bar': { '&': 'getBar'} } - `getBar` is added to the `bar` resource controller
     * parameters:
     * @param {object} parent - the parent route
     * @param {object} routes
     */
    _bindSpecialRoutes(parent, routes) {
      Object.keys(routes).forEach((route) => {
        let handlerSegments = routes[route].split('#');
        let routeSegments = route.split(/\s+/);
        let verb = routeSegments.length > 1 ? routeSegments[0].toLowerCase() : 'get';
        route = this._concatURL(parent.routeEntry, routeSegments.pop());
        let hasController = handlerSegments.length > 1;
        let controllerName = hasController ? handlerSegments[0] : parent.routeName;
        let controller = this._getController(parent.parentDir, controllerName, !hasController);
        this._bindRoute({verb, route, controller, method: handlerSegments.pop()});
      });
    }

    /**
     * Require controller file
     * @param {string} dir - parent directory of the controller
     * @param {string} controllerName - name of the controller
     * @param {boolean} concatSuffix - should be the suffix be added?
     * @param {object} - returns controller file and path
     */
    _getController(dir, controllerName, concatSuffix = true) {
      if (concatSuffix && this.options._hasSuffix)
        controllerName += '_' + this.options.controllersSuffix;
      let _path = path.join(dir, this._resolveFileCase(controllerName));
      return { file: require(_path), path: _path };
    }

    /**
     * Cancatenates all the passed parameters by using `path.join`
     * the `path.join` function is meant to be used for file directory paths
     * but as it removes extra `/` chars and normalizes the paths,
     * the following function uses it for making route binindgs flexible and less
     * error-prone
     * @param {string} ...strings
     */
    _concatURL() {
      return path.join(...arguments);
    }

    /**
     * Get all the set routes
     * @return {Array} - an array of objects
     */
    getBoundRoutes(prettify = false) {
      if ( prettify ) {
        return this.__prettify(this._routes);
      }
      return this._routes;
    }

    /**
     * Get the missing handlers for resources
     */
    getMissingHandlers(prettify = false) {
      if ( prettify ) {
        return this.__prettify(this._missingHandlers);
      }
      return this._missingHandlers;
    }

    __prettify(routes) {
      let len = this.options.controllersDir.length + 1;
      return routes.map(el => ({
        [el.verb]: el.route,
        handler: `${el.controller.path.slice(len)}#${el.method}`
      }));
    }

    /**
     * Add routes to the router
     * @param {object|array} routes
     */
    addRoutes(routes) {
      this._parseRoutes(this._parent, this.options.baseRoute, routes);
    }

    /**
     * Get the instance's router
     * @return {object} router
     */
    getRouter() {
      return this._router;
    }
}

module.exports = ResourceManager;
