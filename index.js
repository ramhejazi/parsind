/**
 * A HTTP resource manager and controller-autoloader
 * @author Ramin Hejazi
 * @copyright MIT © 2016 Ramin Hejazi
 */

const ResourceManager = require('./lib/ResourceManager');
module.exports = function(options) {
  return new ResourceManager(options);
}
