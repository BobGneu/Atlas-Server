var express = require('express');
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;
models = require("../src/db");
var passwordHash = require('password-hash');

var restrict = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access denied!';
        res.redirect('/admin/');
    }
};

var authenticate = function(user, passwordHash, fn) {
    console.log('authenticating %s:%s', user, passwordHash);

    models.User.find({
        name: user
    }, fn);
};

var router = express.Router();

router.get('/', function(req, res) {
    res.render('admin/login', {
        layout: 'layout'
    });
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/overview', function(req, res) {
    res.render('admin/overview', {
        layout: 'admin'
    });
});

router.get('/tracking', function(req, res) {
    res.render('admin/tracking', {
        layout: 'admin'
    });
});

router.get('/users', function(req, res) {
    models.User.find({}, function(err, users) {
        res.render('admin/users', {
            layout: 'admin',
            users: users,
            errors: req.session.errors
        });

    });
});

router.post('/users', form( // Form filter and validation middleware
    filter("username").trim(),
    validate("username").required().is(/^[\w]\w{5,900}$/),
    filter("password").trim(),
    validate("password").required("Password Required").is(/^[\w+-/&*()\[\]]{6,900}$/)
), function(req, res) {

    authenticate(req.body.username, passwordHash.generate(req.body.password), function(err, user) {

        if (typeof user !== 'undefined' && user.length === 0) {
            var user = new models.User({
                Name: req.form.username,
                PasswordHash: passwordHash.generate(req.form.password)
            });
            user.save(function(err, user) {
                console.log(user);
            });
        } else if (typeof err === 'undefined') {
            // error loading the user.
            console.log("null");
        } else {
            // user is known
            console.log("known");
        }

        res.redirect('/admin/users/');
    });
});

router.post('/', function(req, res) {

    if (req.body.username === 'testAdmin')
        res.redirect("/admin/overview");
    else
        res.redirect("/admin/");
});

module.exports = router;
