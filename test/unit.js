var assert = require('assert');
var util = require('../lib/util');

var isValues = {
  'isString': ['string', function() {}],
  'isFunction': [function() {}, []],
  'isArray': [[], 'string'],
  'isUndefined': [undefined, []],
  'isObject': [{}, []]
};

var caseValues = {
  'camel': ['foo_bar', 'fooBar'],
  'pascal': ['foo_bar', 'FooBar'],
  'snake': ['fooBar', 'foo_bar']
};

describe('util', function() {
    Object.keys(isValues).forEach(el => {
      describe('#' + el, function() {
        let type = el.replace('is', '').toLowerCase();
        it(`should return true when a parameter is a(n) ${type} value`, function() {
          assert( util[el](isValues[el][0]) );
        });
        it(`should return false when a parameter is not a(n) ${type} value`, function() {
          assert( !util[el](isValues[el][1]) );
        });
      });
    });
    Object.keys(caseValues).forEach(el => {
      describe('#' + el, function() {
        it('should convert the case correctly', function() {
          assert.equal( util[el]( caseValues[el][0] ), caseValues[el][1]);
        });
      })
    });
});
