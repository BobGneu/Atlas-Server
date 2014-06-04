var express = require('express');
var form = require("express-form");
var filter = form.filter;
var validate = form.validate;
var models = require("../src/db");
var passwordHash = require('password-hash');

var restrict = function (req, res, next) {
	if (req.session.user) {
		next();
	} else {
		req.session.error = 'Access denied!';
		res.redirect('/admin/');
	}
};

var authenticate = function (user, passwordHash, fn) {
	models.User.find({
		name: user
	}, fn);
};

var router = express.Router();

router.get('/', function (req, res) {
	res.render('admin/login', {
		layout: 'layout'
	});
});

router.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/');
});

router.get('/overview', function (req, res) {
	res.render('admin/overview', {
		layout: 'admin'
	});
});

router.get('/tracking', function (req, res) {
	res.render('admin/tracking', {
		layout: 'admin'
	});
});

router.get('/users', function (req, res) {
	models.User.find({}, function (err, users) {
		res.render('admin/users', {
			layout: 'admin',
			users: users,
			errors: req.session.errors
		});
	});
});

router.post('/users', form( // Form filter and validation middleware
	filter("username").trim(),
	filter("email").trim(),
	filter("password").trim(),
	filter("uid").trim(),
	validate("username").required().custom(function (value) {
		if (value.length < 6) {
			throw new Error("%s must be at least 6 characters in length.");
		}
	}).is(/^[a-zA-Z][\w_\-\.]{5,900}$/),
	validate("email").required().isEmail(),
	validate("password").required().custom(function (value) {
		if (value.length < 6) {
			throw new Error("%s must be at least 6 characters in length.");
		}
	}).is(/^[\w\s+-/&*()\[\]]{6,900}$/),
	validate("uid").required()
), function (req, res) {

	if (req.form.isValid) {

		authenticate(req.body.username, passwordHash.generate(req.body.password), function (err, user) {

			if (typeof user !== 'undefined' && user.length === 0) {
				var user = new models.User({
					Name: req.form.username,
					Email: req.form.email,
					UID: req.form.uid,
					PasswordHash: passwordHash.generate(req.form.password)
				});
				user.save(function (err, user) {});
			} else if (typeof err === 'undefined') {
				// error loading the user.
				console.log("null");
			} else {
				// user is known
				console.log("known");
			}

			res.status(201).redirect('/admin/users/');
		});
	} else {
		req.session.errors = req.form.errors;
		res.status(400).redirect('/admin/users/');
	}
});

router.post('/', function (req, res) {

	if (req.body.username === 'testAdmin')
		res.redirect("/admin/overview");
	else
		res.redirect("/admin/");
});

module.exports = router;