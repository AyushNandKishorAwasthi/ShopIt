module.exports = (fu) => (req, res, next) => fu(req, res, next).catch((err) => next(err));
