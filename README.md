# parsind
> HTTP resource route generator and controller autoloader.

Configurable _parsind_ (\ˈpärˈsīnd\\) allows you to use simple
JavaScript data structures for setting RESTful HTTP route handlers.
It works with any sensible HTTP router (e.g. [express framework](http://expressjs.com/)'s router).

## Table of Contents:
- [Installation](#installation)
- [Why?](#why)
- [Example](#example)
- [How does it work?](#how-does-it-work)
  - [Parsing Rules](#1-parsing-rules)
  - [Autoloading Controllers](#2-autoloading-controllers)
  - [Binding Route Handlers](#3-binding-route-handlers)
- [Documentation](#documentation)
- [How-tos](#how-tos)
- [Terminology](#terminology)

## Installation
```
$ npm install pasind
```

## Why?
Setting HTTP route handlers and loading controllers in complex web applications with many resources can be very tiring, error-prone and repetitive process. _parsind_ tries to facilitate this process.  


## Example:
```
application_directory
├── app.js
└── controllers
    ├── indexController.js
    ├── authors
    │   ├── booksController.js
    ├── authorsController.js
    ├── books
    │   ├── authorsController.js
    │   └── tagsController.js
    ├── booksController.js
    ├── tags
    |   ├── booksController.js
    ├── tagsController.js
```

```javascript
// app.js
const express = require('express')
const path = require('path')
const parsind = require('parsind')

const app = express()

const routeParser = parsind({
  controllersDir: path.join(__dirname, 'controllers'),
  router: express.Router(),
  routes: {
    '/': 'indexController#welcome',
    'POST /foo': 'indexController#postFoo',
    'authors': ['books'],
    'books': ['authors', 'tags'],
    'tags': ['books']
  }
});

app.use('/api', routeParser.getRouter())
app.listen(3000)

```
## How does it work?
_parsind_ accepts simple JavaScript data structures (e.g. a parsed JSON string) as
a list of HTTP resources. And it then:

1. Parses the data for generating a list of HTTP routes for each resource.
2. Autoloads a controller file for each resource.
3. Uses methods of controllers for setting HTTP route handlers on the passed router.

### 1. Parsing Rules
The `routes` option can be any structure that consists of (nested) object literals and arrays.
The structure is iterated _recursively_.

#### Object literals
##### Resources
Each object key that has either an object or an array value is considered a _resource_:
```
{
  'resource_name1': [],
  'resource_name2': {},
}
```
The key, as a resource name, is used for generating several routes.
As an example, for a property that has `bars` key, by default the following routes are generated:

| HTTP verb  | URL            |
| ---------- |--------------- |
| GET        | /bars          |
| POST       | /bars          |
| GET        | /bars/:bar_id  |
| PUT        | /bars/:bar_id  |
| PATCH      | /bars/:bar_id  |
| DELETE     | /bars/:bar_id  |

The generated routes are concatenated with the parent resource's _item route_ URL.
As an example, when the parent resource's item route is `/foos/:foo_id`, then the final routes will be:

| HTTP verb  | URL                         |
| ---------- |---------------------------- |
| GET        | /foos/:foo_id/bars          |
| POST       | /foos/:foo_id/bars          |
| GET        | /foos/:foo_id/bars/:bar_id  |
| PUT        | /foos/:foo_id/bars/:bar_id  |
| PATCH      | /foos/:foo_id/bars/:bar_id  |
| DELETE     | /foos/:foo_id/bars/:bar_id  |

##### Routes

Each object key that has a `string` value is considered a route.
This syntax allows you to define _special routes_.  

The key is the _route_'s URL and it's value is the _route handler_.
The key can contain a HTTP verb (in uppercase or in lowercase) .e.g. `GET /foo` or `post /bar`.
When there is no HTTP verb, the route is set as a `GET` request, e.g. `/foo`.

The value of the property refers to a method name (e.g. `getHandler`) of a controller object that should be set as the route handler.

The value can also contain a name of the controller. `#` character should be used for separating controller name and it's property name, e.g. `indexController#getHandler`.

#### Arrays
Array properties can have several elements. Each array can have many `string` or `object`
elements. A `string` element is considered a _resource_
and an `object` element is parsed according to "Object literals" rules.

The key of a property that has the array as it's value is the parent resource of array's elements.

### 2. Autoloading Controllers
#### Resources
For each resource a controller is loaded (required) on the fly.

By default, the resource controller's name is the combination of camelCased resource name and `'Controller.js'` string.
For example, for a resource that has `foo_bars` name, the module expects to find a file that has `fooBarsController.js` filename. The file's path is generated relatively to the parent resource's directory.
Parent resource's directory name of a resource is simply the name of the parent resource.
Consider this example:

```javascript
// ...
const routeParser = parsind({
  controllersPath: '/controllers',
  // other options...
  routes: {
    'books': ['authors', 'tags']
  }
});
```
The filename of `books` resource's controller should be `booksController.js`.
The file should exist in the `/controllers` directory, so the file's path is: `/controller/booksController.js`.
The `books` has 2 child resources: `authors` and `tags`. The controller name of these resources should be
`authorsController.js` and `tagsController.js`.
These 2 files must exist in their parent resource directory, i.e. the `books` directory,
so for these resources, parsind expect you to have this directory structure:

```
/controllers
├── books
│   ├── authorsController.js
│   └── tagsController.js
└── booksController.js
```
#### Special routes
As it was states previously, you can set special routes for each resource and
the value of a route key:value pair which is used for defining a route can contain
either a method name or a combination of a controller name and it's method as the route handler.

Consider this example:
```javascript
{
  'foos': {
    '/bar': 'getFoo',
    'POST /baz': 'controllerName#bazHandler'
  }
}
```
The `foos` resource has 2 child routes. In this case the `getFoo` method should be method
of the `foos` resource's controller, i.e. `foosController#getFoo`.   
The `controllerName` which is specified as the controller for `POST /baz` route
should exist in the `foos` resource directory, so parsind expect you to have this directory structure:

```
/controllers
├── foos
│   └── controllerName.js
└── foosController.js
```
### 3. Binding Route Handlers
After parsing routes and loading controller file, the generated routes are set on the router.

#### Resources
By default, 6 routes for each resource is generated (configurable). The HTTP verbs of these routes are mapped to the resource controller's methods/properties.

| HTTP verb  | URL                     | Method        |
| ---------- | ----------------------- | --------------|
| GET        | /resource               | index         |
| POST       | /resource               | store         |
| GET        | /resource/:resource_id  | show          |
| PUT        | /resource/:resource_id  | update        |
| PATCH      | /resource/:resource_id  | patch         |
| DELETE     | /resource/:resource_id  | destroy       |

Each route is set on the router only when the resource controllers have the corresponding method.
For example, if the resource controller has only 2 methods named `index` and `show` then only the following routes are set:

```javascript
router.get('/resource', controller.index);   
router.get('/resource/:resource_id', controller.show);
```
Any other method/property of the controller that doesn't have `index`, `store`, `show`, `update`, `patch` or `destroy` key is ignored. The value of these properties can be any value that router supports.
For example, Express framework's router allows you pass a function or an array of functions
as the route middlewares/handlers. So the controller files can have these properties:

```js
// anExampleController.js

// ...
module.exports = {
  index(req, res, next) {
      res.send('...');
  },
  // ...
  update: [validationMiddleware, function(req, res, next) {
      res.send('...');
  }]
}
```
#### Special routes
Special routes are set similar to resource routes, but the specified methods _must_ exist.

## Documentation
### Syntax
`parsind(settings)`

### Prameters
**settings** <br>
type: _object_ <br>
A set of key/value pairs.
  - **baseRoute** (default: `"/"`) <br/>
    type: _string_ <br/>
    A base route that is prepended to all generated routes.
  - **controllersDir** <br/>
  type: _string_ <br>
  The _absolute_ path of controllers directory. <br>
  Example: `__dirname + "/controllers"`.
  - **controllersCase** (default: `"camel"`) <br>
  type: _string_ <br>
  The case of controllers' name.
  Value can be `"camel"` for _camelCase_, `"pascal"` for _PascalCase_ or `"snake"` for _snake&#95;case_.
  - **controllersSuffix** (default: `"controllers"`) <br>
  This option is used for generating controller name for a resource. It can be any strings, including an empty string.
  - **controllerMethods** (default: `"{"entrance":{"get":"index","post":"store"},"item":{"get":"show","put":"update","patch":"patch","delete":"destroy"}}"`) <br>
  type: _object_ <br>
  This option accepts an object with 2 object properties: `entrance` and `item`.  
  These properties are used for setting route handlers for a resource by using properties of the resource's controller.
  `entrance` keys are used for setting routes for _resource's entrance_ URL and `item` keys are using are used for setting routes for resource's _item route_ URL.
  - **router** <br>
  type: _object_ <br>
  A router object which is used for setting routes. If you are using Express framework you can pass the return value of
  `require("express")` or `require("express').Router"` function.
  - **routes** <br>
  type: _object_ or _array_ <br>
  A list of resources. Read the "How does it work?" section.

### Return value
`parsind` is a factory function. The returned value is an instance of an ES2015 class. Each instance has the following APIs:

- #### `.addRoutes(routes)`
  Add new routes to the router.
  ###### Parameters
  - **routes** <br>
    type: _object_ or _array_ <br>
    Check the **routes** setting.

- #### `.getRouter()`
  Get the _router_ option.

- #### `.getBoundRoutes(prettify)`
  Get the list of [successfully] bound routes.
  ###### Parameters
  - **prettify** (default: `false`) <br>
    type: _boolean_ <br>
    Make the output more readable.

  ###### Return value
  Returns an array of bound routes. Each route is an object that has the following properties:
  - **verb**: HTTP verb of route.  
  - **route**: Route's path.
  - **controller**: Controller object.
  - **method**: Name of the controller's property which has been used for setting the router handler.

- #### `.getMissingHandlers(prettify)`
  Get the list of missing route handlers.
  ###### Parameters
  - **prettify** (default: `false`) <br>
    type: _boolean_ <br>
    Make the output more readable.

  ###### Return value
  Returns an array of missing handlers. Each route is an object that has the following properties:
  - **verb**: HTTP verb of route.  
  - **route**: Route's path.
  - **controller**: Controller object.
  - **method**: Name of the controller's missing property.

## How-tos
### How to use express middlewares
Express middlewares can be set normally [by using express APIs](http://expressjs.com/en/guide/using-middleware.html):
```js
const express = require('express')
const parsind = require('parsind')

const app = express()
const router = express.Router()

// A general router-level middleware
router.use(function(req, res, next) {
  console.log('an express middleware!')
  next()
});

const routeParser = parsind({
  // ...
  router,
  routes: {
    ...
  }
});

app.use('/', routeParser.getRouter())
app.listen(3000)
```
In case that you want to add a middleware for specific resources, you can code:

```js
const express = require('express')
const parsind = require('parsind')

const app = express()
const router = express.Router()

// A general router-level middleware
// the middleware is called for both /tags... and /books... resources
router.use(function(req, res, next) {
  console.log('an express middleware!')
  next()
});

const routeParser = parsind({
  // ...
  router,
  routes: ['tags']
});

// this middleware is called only for /books... resource
router.use(function(req, res, next) {
  console.log('an express middleware!')
  next()
});

routeParser.addRoutes(['books']);

app.use('/', routeParser.getRouter())
app.listen(3000)
```
### How to extract routes' named parameters
_parsind_ uses _singular form of a resource name_ + _`_id` string_ for generating resources' _item route_. For getting these named parameters without the `_id` string you can use the following snippet (a middleware):

```js
/
/**
 * Get the route's named parameters without the `_id` segments
 * @return {array}
 */
function getNamedParametersMiddlware(req, res, next) {
    let re = /\/:(.*?)_id/g;
    req.resourceNames = [];
    let _res;
    while ((_res = re.exec(req.route.path)) !== null) {
        req.resourceNames.push(_res[1]);
    }
    next();
}    
```
## Terminology
- **Resource**:
A `string` which is used for generating several _routes_.
- **Resource's entrance**:
A resource entrance URL. For example `bars` resource has `/bars` resource entrance URL.
- **Route**:
A HTTP verb + URL.
- **Item route**:
A URL that has an ID placeholder for an individual items of a resource. For example,
`bars` resource has `/bars/:bar_id` item route which is used for setting routes for reading, updating and deleting individual resource's items.
- **Special route**:
A route that is not set for each _resource_ by default.
- **Controller**
A controller is simply an object, exported in a JavaScript file that _should_ or _can_ have some methods.
The module expects you to have a controller file for each resource, even if it doesn't have any manually exported object.

## License
MIT © [HTMLPACK](https://htmlpack.com)
