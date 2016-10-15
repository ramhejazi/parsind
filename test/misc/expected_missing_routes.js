module.exports = [
  { verb: 'get',
    route: '/books/:book_id/tags/:tag_id/foo_bar',
    method: 'index' },
  { verb: 'post',
    route: '/books/:book_id/tags/:tag_id/foo_bar',
    method: 'store' },
  { verb: 'get',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id',
    method: 'show' },
  { verb: 'put',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id',
    method: 'update' },
  { verb: 'patch',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id',
    method: 'patch' },
  { verb: 'delete',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id',
    method: 'destroy' }
];