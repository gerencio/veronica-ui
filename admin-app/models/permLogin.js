var mongoose = require('mongoose');

var PLschema = mongoose.Schema({
    users: {
        type: Array
    },
    suffix: {
        type: String
    }
});



PLschema.statics.validPerm = function(email) {
    function include(arr,obj) {
        return (arr.indexOf(obj) != -1);
    }

    function testSuffix(email,suffix){
        if (suffix.length != 0 && suffix != '*'){
            return email.match(suffix);
        }else{
            return true
        }
    }

    function testUsers(email,users){
        if (users.length != 0){
            return include(users,email);
        }else{
            return true;
        }
    }

    return this.find().exec()
        .then(
        function (perms) {
            return (testSuffix(email,perms[0]._doc.suffix) && testUsers(email, perms[0]._doc.users));
        },
        function (erro) {
            console.error(erro);
            res.status(500).json(erro);
        }
    );
};



module.exports = mongoose.model('PermLogin', PLschema);