var verificaAutenticacao = require('../services/verificaAutenticacao.js');

module.exports = function (app, passport) {

    var jobsController = require('../controllers/jobsController')(passport);

    app.route('/jobs').post(verificaAutenticacao,jobsController.postJob);

    return app;
};