(function (module) {
	'use strict';

	var models = require('./atlas.models'),
		form = require('express-form'),
		filter = form.filter,
		validate = form.validate,
		User = models.User,
		passwordHash = require('password-hash');

	var API = {
		index: function (req, res) {
			models.User.findOne({}, function (err, user) {

				if (err) {
					return res.send(500, {
						error: err
					});
				} else if (!user) {
					res.render('atlas/setup', {
						subtitle: 'Setup & Configuration'
					});
				} else {
					res.render('atlas/index');
				}
			});
		},
		setupValidation: form(
			filter('name').trim(),
			validate('name').required(),
			filter('email').trim(),
			validate('email').isEmail().required(),
			filter('password').trim(),
			validate('password').required(),
			filter('password-conf').trim(),
			validate('password-conf').equals('field::password')
		),
		setup: function (req, res) {

			if (req.form.isValid) {
				models.User.findOne({}, function (err, user) {

					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!user) {

						// create user in db

						var tmp = new User({
							Name: req.form.name,
							Email: req.form.email,
							PasswordHash: passwordHash.generate(req.form.password),
							Role: 'Administrator',
						});

						tmp.save(function (err, user) {
							// login with that user & redirect to the login 
							res.redirect('/login');
						});
					} else {
						res.render('atlas/index');
					}
				});
			} else {
				res.render('atlas/setup', {
					subtitle: 'Setup & Configuration',
					messages: req.form.messages
				});
			}
		},
		login: function (req, res) {
			res.render('atlas/login', {
				subtitle: 'User Login'
			});
		},
		logout: function (req, res) {
			req.session.destroy(function () {
				res.redirect('/');
			});
		},
		overview: function (req, res) {
			res.render('atlas/overview', {
				subtitle: 'Overview'
			});
		}
	};

	module.exports = API;
})(module);
