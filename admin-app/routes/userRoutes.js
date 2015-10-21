var verificaAutenticacao = require('../services/verificaAutenticacao.js');
// load the auth variables from mongo
var SocialMedia = new require('../models/socialMedia');

module.exports = function (app, passport) {

    var userController = require('../controllers/userController')(passport);


    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    });

    // GOOGLE ROUTES =======================
    // send to google to do the authentication
    // profile gets us their basic information including their name
    // email gets their emails
    if (SocialMedia.hasSocial("google")) {

        app.route('/auth/google').get(userController.authenticateGoogle(passport));
        // the callback after google has authenticated the user
        app.route('/auth/google/callback').get(userController.authenticateGoogleCallBack(passport));
    }


    app.route('/user/picture').get(verificaAutenticacao,userController.getPictureUrl);
    app.route('/user/logout').get(verificaAutenticacao,userController.logout );
    app.route('/user/json').get(verificaAutenticacao,userController.json);

    return app;
};