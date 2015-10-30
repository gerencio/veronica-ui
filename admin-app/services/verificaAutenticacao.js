// route middleware to make sure a user is logged in
function verificaAutenticacao(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //res.status('401').json('Não autorizado'); // comentado temporariamente para testes
        return next();
    }
}

module.exports = verificaAutenticacao;