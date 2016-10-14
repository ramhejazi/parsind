/**
 * A function that is used for handling HTTP route handlers
 */
function generalHandler(req, res, next) {
  res.json(req.route.path);
}

/**
 * A function that is used for generating controllers
 * it's used only as an exmaple! Not meant to be used as a real-application controller.
 * Uses Array.prototype.reduce for defining methods
 * @type {Object}
 */
module.exports = function(handler) {
  return ['index', 'update', 'patch', 'store', 'show', 'destroy'].reduce((ret, el) => {
    ret[el] = handler || generalHandler;
    return ret;
  }, {});
};
