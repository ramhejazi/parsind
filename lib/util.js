const util = ['camel', 'snake', 'pascal'].reduce((ret, _case) => {
    ret[_case] = require(_case + '-case')[_case + 'Case'];
    return ret;
}, {});

['isObject', 'isString', 'isArray', 'isFunction', 'isUndefined'].reduce((ret, method) => {
  let _case = method.replace('is', '');
  ret[method] = function(param) {
    return Object.prototype.toString.call(param) === `[object ${_case}]`;
  }
  return ret;
}, util);

module.exports = util;
