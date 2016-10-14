module.exports = {
  welcome(req, res, next) {
    res.json('Welcome!');
  },

  postBar(req, res, next) {
    res.json('POST /bar handler');
  }
}
