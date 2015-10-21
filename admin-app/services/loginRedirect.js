module.exports = function (req, res, next) {
    res.redirect('/');
    return next();
};