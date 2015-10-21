
//var options = {
//    user: process.env.XDUKA_USER,
//    pass: process.env.XDUKA_PASS
//};

module.exports = {
//    'url': 'mongodb://localhost/easy-node-authentication' // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    'url': process.env.ADMIN_UI_URL
    //'options' : options
};