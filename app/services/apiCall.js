const format = require('string-format');
const reqPro = require("request-promise");
const extend = require('extend');


const methods = {
    GET : "GET",
    POST : "POST",
    PUT : "PUT",
    DELETE : "DELETE"
};


apiGetErr =  (error,res) => {
    var msgerr = {};


    if (!!error.error) {
        switch (error.error.name) {
            case 'ValidationError':
                msgerr  = {err : "Erro de validação de dados"};
                fieldarr = [];
                for (field in error.error.errors) {
                    switch (error.error.errors[field].kind) {
                        case 'required':
                            fieldarr.push({ field : field , err : 'campo "' + field + '" é obrigatório'});
                            break;
                        case 'invalid':
                            fieldarr.push({ field : field , err : 'campo "' + field + '" é inválido'});
                            break;
                    }
                }
                extend(true,msgerr,{fields : fieldarr});
                break;
            default:
                msgerr = error.error.errors;
        }

    }

    return res.status(!!error.statusCode?error.statusCode:500).json({statusCode: error.statusCode||500});
};



apiCall =  (endpoint , user , pass ,token) => ( entity , method ,reqData ) => {

    var body = null;
    var qs = null;
    var externalHost = null;

    if (reqData && reqData['externalHost']){
        externalHost = reqData['externalHost'];
        delete  reqData['externalHost'];
    }

    var uri = externalHost?externalHost:endpoint;

    if ((method === methods.GET || method === methods.DELETE)&&(reqData)){
        //uri += format(entity,reqData)
        uri +=  entity;
        qs = reqData;
    }else{
        uri +=  entity;
        body = reqData
    }



    var options = {


        uri: uri ,
        headers : {
            'Content-Type': 'application/json'
        },
        method: method,
        json : body,
        qs: qs,
        resolveWithFullResponse: true
    };

    if (token) {
        options.auth = {
            bearer: token
        }
    }

    if (user && pass) {
        options.auth = {
            'user': user,
            'pass': pass,
            'sendImmediately': true
        };
    }

    return reqPro(options)
        .then(function(resp){
        var  data = {};
        if (typeof(resp.body) === "string"){
            data = JSON.parse(resp.body)
        }else{
            data = resp.body
        }
        return { data : data , status:  resp.statusCode};
    });

};



module.exports = (endpoint,user,pass,token) => {
    return {
        apiCall : apiCall(endpoint,user,pass,token),
        method : methods,
        apiGetErr : apiGetErr
    }
};
