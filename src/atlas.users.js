(function (module) {
	'use strict';

	var models = require('./atlas.models'),
		User = models.User,
		form = require('express-form'),
		filter = form.filter,
		validate = form.validate,
		passwordHash = require('password-hash');

	API = {
		paramLookup: function (req, res, next, id) {
			try {
				models.User.findOne({
					_id: models.ObjectId(id)
				}, function (err, user) {

					if (err) {
						return next(err);
					} else if (!user) {
						return next(new Error('failed to load user'));
					}

					req.params.user = user;
					next();
				});
			} catch (e) {
				if (req.isAuthenticated()) {
					next(new Error('Invalid User ID'));
				} else {
					res.redirect('/login');
					next();
				}
			}
		},
		index: function (req, res) {
			User.find({}, function (err, users) {
				res.render('users/index', {
					users: users
				});
			});
		},
		createValidation: form(
			filter('name').trim(),
			validate('name').required(),
			filter('email').trim(),
			validate('email').isEmail().required(),
			filter('password').trim(),
			validate('password').required(),
			filter('password-conf').trim(),
			validate('password-conf').equals('field::password'),
			filter('role').trim(),
			validate('role').required()
		),
		create: function (req, res) {
			if (req.form.isValid) {
				var tmp = new User({
					Name: req.form.name,
					Email: req.form.email,
					PasswordHash: passwordHash.generate(req.form.password),
					Role: req.form.role,
				});

				tmp.save(function (err, user) {
					res.redirect('/users/' + user._id);
				});
			} else {
				req.session.messages = req.form.errors;
				req.failed();
			}
		},
		read: function (req, res) {
			res.render('users/read', {
				user: req.params.user
			});
		},
		update: function (req, res) {

			try {
				models.User.findOne({
					_id: models.ObjectId(req.body.pk)
				}, function (err, user) {
					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!user) {
						return res.send(400, 'Bad request');
					}

					if (req.body.name === 'Role') {
						user.Role = req.body.value === 'Administrator' ? 'Administrator' : 'Manager';
					} else if (req.body.name === 'Email') {
						user.Email = req.body.value.toLowerCase();
					}

					console.log(user);

					user.save(function (err, user) {

						if (err) {
							return res.send(500, {
								error: err
							});
						} else if (!user) {
							return res.send(400, 'Bad request');
						}

						res.send(200, user.Role);
					});
				});
			} catch (e) {
				if (req.isAuthenticated()) {
					res.send(400, 'Bad request');
				} else {
					res.redirect('/login');
				}
				next();
			}
		},
		delete: function (req, res) {

			try {
				models.User.findOne({
					_id: models.ObjectId(req.body.pk)
				}, function (err, user) {

					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!user) {
						return res.send(400, 'Bad request');
					}

					user.remove(function (err, user) {

						if (err) {
							return res.send(500, {
								error: err
							});
						} else if (!user) {
							return res.send(400, 'Bad request2');
						}

						res.send(200);
					});
				});
			} catch (e) {
				if (req.isAuthenticated()) {
					res.send(400, 'Bad request3');
				} else {
					res.redirect('/login');
				}
				next();
			}
		},
		restricted: function (req, res, next) {
			// Unauthenticated users get redirected to the login page
			if (!req.isAuthenticated()) {
				return res.redirect('/login');
			}

			// Otherwise you are fine
			next();
		}
	};

	module.exports = API;
})();
