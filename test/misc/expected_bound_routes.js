module.exports = [
  { verb: 'get', route: '/', method: 'welcome' },
  { verb: 'post', route: '/', method: 'welcome' },
  { verb: 'get', route: '/books', method: 'index' },
  { verb: 'post', route: '/books', method: 'store' },
  { verb: 'get', route: '/books/:book_id', method: 'show' },
  { verb: 'put', route: '/books/:book_id', method: 'update' },
  { verb: 'patch', route: '/books/:book_id', method: 'patch' },
  { verb: 'delete', route: '/books/:book_id', method: 'destroy' },
  { verb: 'get',
    route: '/books/:book_id/authors',
    method: 'index' },
  { verb: 'post',
    route: '/books/:book_id/authors',
    method: 'store' },
  { verb: 'get',
    route: '/books/:book_id/authors/:author_id',
    method: 'show' },
  { verb: 'put',
    route: '/books/:book_id/authors/:author_id',
    method: 'update' },
  { verb: 'patch',
    route: '/books/:book_id/authors/:author_id',
    method: 'patch' },
  { verb: 'delete',
    route: '/books/:book_id/authors/:author_id',
    method: 'destroy' },
  { verb: 'get', route: '/books/:book_id/tags', method: 'index' },
  { verb: 'post', route: '/books/:book_id/tags', method: 'store' },
  { verb: 'get',
    route: '/books/:book_id/tags/:tag_id',
    method: 'show' },
  { verb: 'put',
    route: '/books/:book_id/tags/:tag_id',
    method: 'update' },
  { verb: 'patch',
    route: '/books/:book_id/tags/:tag_id',
    method: 'patch' },
  { verb: 'delete',
    route: '/books/:book_id/tags/:tag_id',
    method: 'destroy' },
  { verb: 'get',
    route: '/books/:book_id/tags/foo',
    method: 'getFoo' },
  { verb: 'get',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id/bars',
    method: 'index' },
  { verb: 'post',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id/bars',
    method: 'store' },
  { verb: 'get',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id/bars/:bar_id',
    method: 'show' },
  { verb: 'put',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id/bars/:bar_id',
    method: 'update' },
  { verb: 'patch',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id/bars/:bar_id',
    method: 'patch' },
  { verb: 'delete',
    route: '/books/:book_id/tags/:tag_id/foo_bar/:foo_bar_id/bars/:bar_id',
    method: 'destroy' },
  { verb: 'get', route: '/authors', method: 'index' },
  { verb: 'post', route: '/authors', method: 'store' },
  { verb: 'get', route: '/authors/:author_id', method: 'show' },
  { verb: 'put', route: '/authors/:author_id', method: 'update' },
  { verb: 'patch', route: '/authors/:author_id', method: 'patch' },
  { verb: 'delete',
    route: '/authors/:author_id',
    method: 'destroy' },
  { verb: 'get',
    route: '/authors/:author_id/tags',
    method: 'index' },
  { verb: 'post',
    route: '/authors/:author_id/tags',
    method: 'store' },
  { verb: 'get',
    route: '/authors/:author_id/tags/:tag_id',
    method: 'show' },
  { verb: 'put',
    route: '/authors/:author_id/tags/:tag_id',
    method: 'update' },
  { verb: 'patch',
    route: '/authors/:author_id/tags/:tag_id',
    method: 'patch' },
  { verb: 'delete',
    route: '/authors/:author_id/tags/:tag_id',
    method: 'destroy' },
  { verb: 'get',
    route: '/authors/:author_id/books',
    method: 'index' },
  { verb: 'post',
    route: '/authors/:author_id/books',
    method: 'store' },
  { verb: 'get',
    route: '/authors/:author_id/books/:book_id',
    method: 'show' },
  { verb: 'put',
    route: '/authors/:author_id/books/:book_id',
    method: 'update' },
  { verb: 'patch',
    route: '/authors/:author_id/books/:book_id',
    method: 'patch' },
  { verb: 'delete',
    route: '/authors/:author_id/books/:book_id',
    method: 'destroy' } ]
