var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../models').User;
var config = require('../config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new GoogleStrategy(
    {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: config.GOOGLE_AUTH_CB
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ oAuthId: profile.id }, function (err, user) {
            console.log(profile);
            if (err) {
                console.log(err);
                done(err);
            }
            else if (!err && user !== null) {
                done(null, user);
            }
            else {
                // create user
                user = new User({ username: profile.id });
                user.oAuthId = profile.id;
                user.oAuthToken = accessToken;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.displayName = profile.displayName;
                user.imageUrl = profile.photos[0].value;
                user.status = true;
                user.save((err) => {
                    if(err) {
                        console(err);
                        cb(err);
                    }
                    else {
                        done(null, user);
                    }
                });
            }

        });
    }
));