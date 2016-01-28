module.exports = function() {

    const verificaAutenticacao = require('../services/verificaAutenticacao.js');
    const Database = require('../models/job.js');
    const sanitize = require('mongo-sanitize');


    var jobsController = {};

    jobsController.getJobs = function(req,res) {
        "use strict";

    };


    jobsController.postJob = function(req, res) {

        var _id = req.body.job._id;
        if(_id) {
            Database.findByIdAndUpdate(_id, req.body.job).exec()
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
            Database.create(req.body.job)
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
