var verificaAutenticacao = require('../services/verificaAutenticacao.js');



module.exports = function (app, passport, endpoint, user , pass , token , path){
    function get_from_proxy(request, response) {
        "use strict";
        var api = require('../services/apiCall.js')(endpoint,user,pass,token);


        let reqData = null;
        let entity = request.path.replace(new RegExp(path, 'i'), '');
        if (request.method === api.method.GET || request.method === api.method.DELETE){
            reqData = null;
        }else{
            reqData = request.body;
        }

        return api.apiCall(entity , request.method ,reqData );

    }

    app.route(path + '*').all(verificaAutenticacao,function (req, res, next) {
        get_from_proxy(req, res)
            .then((resp)=> {
                return res.json(resp.data);
            })
            .catch((err) => console.log(err));
        // todo implementar o tratamento de erro novo
    });

    return app;

};

