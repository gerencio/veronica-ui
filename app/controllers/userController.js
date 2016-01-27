var verificaAutenticacao = require('../services/verificaAutenticacao.js');

module.exports = function() {
    var userController = {};
    userController.json = function (req, res) {
        res.json({success: true, obj: {
            name: req.user.google.name,
            email: req.user.google.email
        }});
    };

    userController.authenticateGoogle = function(passport) {
        return passport.authenticate('google', { scope: ['email','profile'] });
    };

    userController.authenticateGoogleCallBack = function(passport){
        return passport.authenticate('google', {
            successRedirect: '/',
            failureRedirect: '/#/login'
        });
    };


    userController.logout =  function (req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/#/login');
    };


    userController.getPictureUrl = function (req, res) {
        return res.json(req.user.google.picture);
    };





    return userController;
};
