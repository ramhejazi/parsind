/**
 * Resource controller example:
 * @route /books/:book_id/tags/(:tag_id)
 * @type {PlainObject}
 */
const controller = require('../_fakeController')();
controller.getFoo = function(req, res) {
  res.send('getFoo handler');
}
module.exports = controller;
