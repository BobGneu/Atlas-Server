var express = require('express');
var form = require("express-form"),
    filter = form.filter,
    validate = form.validate;

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
    res.render('admin/users', {
        layout: 'admin', errors: req.session.errors
    });
});

router.post('/users', form( // Form filter and validation middleware
    filter("username").trim(),
    validate("username").required().is(/^\w+$/),
    filter("password").trim(),
    validate("password").required().is(/^[\w+-/&*()\[\]]{6,900}$/)
), function(req, res) {
    if (!req.form.isValid) {
        // Handle errors
        req.session.errors = req.form.errors; 
    } else {
        req.session.errors = {};
    }

    req.session.save(function(err) {
        // session saved
        res.redirect("/admin/users/");
    })

});

router.post('/', function(req, res) {

    if (req.body.username === 'testAdmin')
        res.redirect("/admin/overview");
    else
        res.redirect("/admin/");
});

module.exports = router;
