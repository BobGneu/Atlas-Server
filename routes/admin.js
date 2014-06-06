var express = require('express');
var form = require("express-form");
var filter = form.filter;
var validate = form.validate;
var models = require("../src/db");
var passwordHash = require('password-hash');
var async = require("async");
var passport = require("passport");

var router = express.Router();

var restricted = function (req, res, next) {

	// if user is authenticated in the session, carry on 
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/admin/');
};

router.param("id", function (res, req, next, id) {

	console.log(id);

	models.User.find({
		_id: new models.ObjectId(id)
	}, function (err, user) {
		if (err) {
			return next(err);
		} else if (!user) {
			return next(new Error('failed to load user'));
		}

		req.user = user[0];

		next();
	});
});

router.get('/', function (req, res) {
	req.session.touch();
	res.render('admin/login', {
		layout: 'layout'
	});
});

router.get('/createAdmin', function (req, res) {
	var user = new models.User({
		Name: "testAdmin",
		Email: "admin@gneu.org",
		UID: "0",
		PasswordHash: passwordHash.generate("testAdmin")
	});

	user.save(function (err, user) {
		res.redirect('/');
	});
});

router.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/');
});

router.get('/overview', restricted, function (req, res) {
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

	/*if (req.form.isValid) {
		authenticate(req.body.username, passwordHash.generate(req.body.password), function (err, user) {

			var done = function () {
				models.User.find({}, function (err, users) {
					res.status(201).render('admin/users', {
						layout: 'admin',
						users: users,
						errors: req.session.errors
					});
				});
			};

			if (typeof user !== 'undefined' && user.length === 0) {
				var user = new models.User({
					Name: req.form.username,
					Email: req.form.email,
					UID: req.form.uid,
					PasswordHash: passwordHash.generate(req.form.password)
				});

				user.save(function (err, user) {
					done();
				});
				return;
			} else if (typeof err === 'undefined') {
				// error loading the user.
				console.log("null");
			} else {
				// user is known
				console.log("known");
			}
			done();
		});
	} else {
		;/
		res.status(400).redirect('/admin/users/');
	}*/
	req.session.errors = req.form.errors;
	models.User.find({}, function (err, users) {
		res.status(201).render('admin/users', {
			layout: 'admin',
			users: users,
			errors: req.session.errors
		});
	});
});

router.get('/users/delete/:id', function (req, res) {

	console.log(req.param['id']);

	//models.User.remove(res.user, function (e) {

	models.User.find({}, function (err, users) {
		res.status(201).render('admin/users', {
			layout: 'admin',
			users: users,
			errors: req.session.errors
		});
	});
	//});
});

router.post('/',
	passport.authenticate('local', {
		successRedirect: '/admin/overview',
		failureRedirect: '/admin/'
	}));

module.exports = router;