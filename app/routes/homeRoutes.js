var isLoggedIn = require('../services/isLoggedIn.js');
var isNotLoggedIn = require('../services/isNotLoggedIn.js');

module.exports = function (app, passport) {

    var homeController = require('../controllers/homeController')();



    //404 ================================
    app.get('/404',
        function(req,res){
            res.redirect('/#/404');
        }
    );

    //500 ================================
    app.get('/500',
        function(req,res){
            res.redirect('/#/500');
        }
    );


    //home path
    // INDEX SECTION =====================
    app.get('/',  homeController.index);




    return app;
};