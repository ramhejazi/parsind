const express = require('express');
const path = require('path');
const assert = require('assert');
const parsind = require('..');
const request = require('supertest');

const expectedMissingRoutes = require('./misc/expected_missing_routes');
const expectedBoundRoutes = require('./misc/expected_bound_routes');
const routeListCompare = require('./misc/route_list_compare');

const app = express();
const router = express.Router();
const routes = {
  'GET /': 'indexController#welcome',
  'POST /': 'indexController#welcome',
  'books': [
    'authors',
    {
      'tags': {
        'GET /foo': 'getFoo',
        'foo_bar': ['bars']
      }
    }
  ],
  'authors': ['tags', 'books']
};

var instance = parsind({
  controllersDir: path.join(__dirname, '..', 'example/controllers'),
  router,
  routes
});

describe('parsind', function() {
  describe('initialization', function() {
    it('should set all the expected routes', function() {
      let actualBoundRoutes = instance.getBoundRoutes();
      assert.ok(routeListCompare(actualBoundRoutes, expectedBoundRoutes));
      assert.equal(instance._routes.length, 45);
    });
    it('should ignore non-existent resource handlers', function() {
      let actualMissingRoutes = instance.getMissingHandlers();
      assert.equal(actualMissingRoutes.length, 6);
      assert.ok(routeListCompare(actualMissingRoutes, expectedMissingRoutes));
    });
  });

  ['getBoundRoutes|_routes', 'getMissingHandlers|_missingHandlers'].forEach(el => {
    let [method, prop] = el.split('|');
    describe('#' + method, function() {
      it('should return all the expected routes', function() {
        let actualRoutes = instance[method]();
        assert.equal(actualRoutes, instance[prop]);
      });
      it('should prettify the routes', function() {
        let ugly = instance[method]()[0];
        let pretty = instance[method](true)[0];
        let len = instance.options.controllersDir.length + 1;
        assert.deepEqual({
          route: `${ugly.verb.toUpperCase()} ${ugly.route}`,
          handler: `${ugly.controller.path.slice(len)}#${ugly.method}`
        }, pretty);
      })
    });
  });


  describe('#addRoutes', function() {
    it('should add routes to the router successfully', function() {
      instance.addRoutes({
        'tags': [
          'authors',
          {
            'books': {
              'POST sort': 'postSortBooks'
            }
          }
        ],
      });
      assert.equal(instance.getBoundRoutes().length, 64);
    });
  });

  describe('#getRouter', function() {
    it("should return the instance's router option", function() {
      assert.ok( instance.getRouter() === router );
    });
  });

  describe('/books resource', function() {
      app.use('/', instance.getRouter());
      var routes = {
        'get /books': 'Books!',
        'post /books': 'A book has been validated and stored!',
        'get /books/10': 'Book #10!',
        'put /books/11': 'Book #11 has been updated!',
        'patch /books/120': 'Book #120 has been patched!',
        'delete /books/6': 'Book #6 has been removed!'
      };

      Object.keys(routes).forEach(function(el) {
        let [method, route] = el.split(' ');
        let agent = request.agent(app);
        describe(`${method.toUpperCase()} ${route}`, function() {
          it('should return ' + routes[el], function(done) {
            agent[method](route)
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              assert.equal(res.text, routes[el]);
              done();
            });
          });
        })
      });
  });


});
