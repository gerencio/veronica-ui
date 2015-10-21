module.exports = function (req, res, next) {
    if (!!req.user.local.admin)
        return next();
    res.redirect('/');
};