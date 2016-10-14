/**
 * Compare 2 list of unordered routes
 * @param  {array} a
 * @param  {array} b
 * @return {boolean}
 */
module.exports = function(a, b) {
  return a.length && b.length && a.every(route => {
    return !!b.find(_route => {
      return route.verb === _route.verb
             && route.method === _route.method
             && route.route === _route.route;
    });
  });
}
