// load all the things we need
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the perms model
var PermLogin = require('../models/permLogin');

// load up the user model
var User = require('../models/user');

// load the auth variables from mongo
var SocialMedia = new require('../models/socialMedia');

// expose this function to our app using module.exports
module.exports = function (passport) {

    // passport session setup ==================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });



    // GOOGLE ==================================================================
    SocialMedia.authSocial("google")
        .then(function(configAuth){
            if (configAuth.length > 0) {
                var configDataAuth = configAuth[0]._doc.config[0];
                passport.use(new GoogleStrategy(configDataAuth,
                    function (req, accessToken, refreshToken, profile, done) {

                        // make the code asynchronous
                        // User.findOne won't fire until we have all our data back from Google
                        process.nextTick(function () {

                            // try to find the user based on their google id
                            User.findOne({ 'google.id': profile.id }, function (err, user) {
                                if (err) {
                                    return done(err);
                                }
                                if (user) {
                                    // if a user is found, log them in
                                    PermLogin.validPerm(profile.emails[0].value)
                                        .then(function (val){
                                            if (val){
                                                return done(null, user);
                                            }else{
                                                return done(null, false, {message: "Acesso não permitido."});
                                            }
                                        });

                                } else {
                                    // if the user isnt in our database, create a new user

                                    //validando por regras de permissoes
                                    PermLogin.validPerm(profile.emails[0].value)
                                        .then(function(val){
                                            if (val){
                                                var newUser = new User();
                                                var picture = profile._json['image'].url;
                                                // set all of the relevant information
                                                newUser.google.id = profile.id;
                                                newUser.google.token = accessToken;
                                                newUser.google.name = profile.displayName;
                                                newUser.google.email = profile.emails[0].value; // pull the first email
                                                newUser.google.picture = picture;
                                                newUser.save();
                                                return done(null, newUser);

                                            } else {
                                                return done(null, false, {message: "Acesso não permitido."});
                                            }
                                        },
                                        function(err){
                                            return done(null, false, {message: "Acesso não permitido."});
                                        });

                                }
                            });

                        });

                    }));

            }

        },
        function(err){
            return done(null, false, {message: "Erro com autenticação de login."});
        });

};