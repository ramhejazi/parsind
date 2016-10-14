/**
 * Resource controller example:
 * @route /books/(:book_id)
 * @type {PlainObject}
 */
module.exports = {
  /**
   * show all books
   * @route GET /books
   */
  index(req, res, next) {
    res.send('Books!');
  },

  /**
   * show a book by id
   * @route GET /books/:book_id
   */
   show(req, res, next) {
     res.send(`Book #${req.params.book_id}!`);
   },

   /**
    * store a book
    * @route POST /books
    */
   store: [
     function validator(req, res, next) {
       req.flag = 'validated';
       next();
     }, function(req, res, next) {
       res.send(`A book has been ${req.flag} and stored!`);
   }],

   /**
    * Updating a book
    * @route PUT /books/:book_id
    */
   update(req, res, next) {
     res.send(`Book #${req.params.book_id} has been updated!`);
   },

   /**
    * Patching a book
    * @route PATCH /books/:book_id
    */
    patch(req, res, next) {
      res.send(`Book #${req.params.book_id} has been patched!`);
    },

    /**
     * Deleting a book
     * @route DELETE /books/:book_id
     */
    destroy(req, res, next) {
      res.send(`Book #${req.params.book_id} has been removed!`);
    }
}
