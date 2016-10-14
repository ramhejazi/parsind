const express = require('express');
const path = require('path');

const app = express();
const parsind = require('../index');
const router = express.Router();

var binder = parsind({
  controllersDir: path.join(__dirname, '/controllers'),
  router,
  controllersCase: 'camel',
  baseRoute: '/',
  controllersSuffix: 'controller',
  routes: {
    '/': 'indexController#welcome',
    'POST /bar': 'indexController#postBar',
    'books': [
      'authors',
      {
        'tags': {
          'GET /foo': 'getFoo',
          'foo_bar': ['bars']
        }
      }
    ],
    'tags': {
      'authors': {},
      'books': {
        'POST /sort': 'postSortBooks'
      }
    }
  }
});


app.use('/', router);
app.listen(4000);

module.exports = app;
