// configuracao herdada do xduka
var express = require('express');
var lessMiddleware = require('less-middleware');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var http = require('http');
var app = express();



// configuration ===============================================================
var configDB = require('./config/database.js'),
    configRedis = require('./config/redis.js'),
    proxies = require('./config/proxies.js');

mongoose.connect(configDB.url); // connect to our database

// view engine setup
if (app.get('env') === 'development') {
    app.set('views', path.join(__dirname, 'views'));
}else{
    app.set('views', path.join(__dirname, 'dist/views'));
}

app.set('view engine', 'ejs'); // set up ejs for templating

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.raw({limit: '50mb'})); // get information from html forms / limite upload de arquivo 50mb
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
if (app.get('env') === 'development') {
    app.use(express.static(path.join(__dirname, 'public')));
}else{
    app.use(express.static(path.join(__dirname, 'public/dist')));
}



app.use(session({
        store: new RedisStore(configRedis),
        cookie: {maxAge: (24 * 3600 * 1000 * 180)}, // 180 Days in ms
        secret: 'ilovescotchscotchyscotchscotch',
        resave: true,
        saveUninitialized: true
    })
);



// required for passport
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session());// persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
// load our routes and pass in our app and fully configured passport
require('./routes/homeRoutes')(app, passport);
//mesos route
require('./routes/proxyRoutes')(app, passport, proxies.mesos.http_host, proxies.mesos.http_port, "/", proxies.mesos.prefix, http, express, proxies.mesos.prefix);
//chronos route
require('./routes/proxyRoutes')(app, passport, proxies.chronos.http_host, proxies.chronos.http_port, "/", proxies.chronos.prefix, http, express, proxies.chronos.prefix);
require('./routes/userRoutes')(app, passport);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  //next(err);
  res.render('404')
});

/// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}else {
  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('500', {
      message: err.message,
      error: err
    });
  });
}



module.exports = app;

