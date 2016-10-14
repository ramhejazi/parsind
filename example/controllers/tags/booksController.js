/**
 * Resource controller example:
 * @route /tags/:tag_id/books/(:book_id)
 * @type {PlainObject}
 */
let controller = require('../_fakeController')();
controller.postSortBooks = function(req, res) {
  res.json('postSortBooks handler');
}
module.exports = controller;
