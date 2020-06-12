var passport = require('passport');
var User = require('../models/userModel');
var LocalStrategy = require('passport-local').Strategy;


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local.signup', new LocalStrategy({
    usernameField: 'phoneUser',
    passwordField: 'passWord',
    passReqToCallback: true
}, function (req, phoneUser, passWord, done) {
    req.checkBody('phoneUser', 'Ivalid phone').notEmpty().isEmail();
    req.checkBody('passWord', 'Ivalid password').notEmpty().isLength({ min: 4 });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(
            function (error) {
                messages.push(error.msg);
            }
        );
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({ phoneUser: phoneUser }, function (err, user) {
        if (err) {

            return done(err);
        }
        if (user) {
            return done(null, false, { message: 'Phone is already in use.' });
        }
        var newUser = new User();
        newUser.phoneUser = phoneUser;
        newUser.passWord = newUser.encryptPasword(passWord);
        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    })
}));


passport.use('local.signin', new LocalStrategy({
    usernameField: 'phoneUser',
    passwordField: 'passWord',
    passReqToCallback: true
}, function (req, phoneUser, passWord, done) {
    req.checkBody('phoneUser', 'Không để trống').notEmpty();
    req.checkBody('passWord', 'ivalid password').notEmpty().isLength({ min: 4 });
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(
            function (error) {
                messages.push(error.msg);
            }
        );
        return done(null, false, req.flash('error', messages));
    }

    // if (passWord != "admin") {
    //     return done(null, false, {message: 'Wrong password.'});
    // }
    // return done(null, user);
    User.findOne({ phoneUser: "0902646558" }, function (err, user) {

        if (err) {
            return done(err);
        }
        if (phoneUser != "admin")
            return done(null, false, { message: 'No user found.' });
        // if (!user) {
        //     return done(null, false, {message: 'No user found.'});
        // }
        //const validPassword = user.validatePassword(passWord, user.passWord);
        if (passWord != "admin") {
            return done(null, false, { message: 'Wrong password.' });
        }
        return done(null, user);
    });
}));