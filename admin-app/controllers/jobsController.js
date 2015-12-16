var verificaAutenticacao = require('../services/verificaAutenticacao.js');
var Database = require('../models/job.js');
var sanitize = require('mongo-sanitize');

module.exports = function() {
    var jobsController = {};

    jobsController.postJob = function(req, res) {

        var _id = req.body.job._id;
        if(_id) {
            Database.findByIdAndUpdate(_id, req.body).exec()
                .then(
                function(data) {
                    res.json(data);
                },
                function(erro) {
                    console.error(erro);
                    res.status(500).json(erro);
                }
            );
        } else {
            Database.create(req.body)
                .then(
                function(data) {
                    res.status(201).json(data);
                },
                function(erro) {
                    console.log(erro);
                    res.status(500).json(erro);

                }
            );
        }
    };

    return jobsController;
};
