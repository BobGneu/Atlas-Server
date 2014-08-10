(function (module) {
	'use strict';

	var Application = require('./atlas.models').Application,
		form = require('express-form'),
		filter = form.filter,
		validate = form.validate;

	var API = {
		paramLookup: function (req, res, next, id) {
			try {
				Application.findOne(id, function (err, app) {

					if (err) {
						return next(err);
					} else if (!app) {
						return next(new Error('failed to load app'));
					}

					req.params.application = app;
					next();
				});
			} catch (e) {
				if (req.isAuthenticated()) {
					next(new Error('Invalid Application ID'));
				} else {
					res.redirect('/login');
					next();
				}
			}
		},
		index: function (req, res) {
			Application.find({}, function (err, applications) {
				res.render('applications/index', {
					applications: applications
				});
			});
		},
		createValidation: form(
			filter('name').trim(),
			validate('name').required(),
			filter('allowGame').trim(),
			filter('allowEditor').trim(),
			validate('allowGame'),
			validate('allowEditor')
		),
		create: function (req, res) {
			if (req.form.isValid) {
				var tmp = new Application({
					Name: req.form.name,
					AllowGame: req.form.allowGame,
					AllowEditor: req.form.allowEditor
				});

				tmp.save(function (err, application) {
					res.redirect('/applications/' + application._id);
				});
			} else {
				req.session.messages = req.form.errors;
				req.failed();
			}
		},
		read: function (req, res) {
			res.render('applications/read', {
				application: req.params.application
			});
		},
		update: function (req, res) {
			try {
				Application.findOne(req.body.pk, function (err, app) {
					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!app) {
						return res.send(400, 'Bad request');
					}

					if (req.body.name === 'AllowGame') {
						app.AllowGame = req.body.value === 'True';
					} else if (req.body.name === 'AllowEditor') {
						app.AllowEditor = req.body.value === 'True';
					}

					app.save(function (err, app) {

						if (err) {
							return res.send(500, {
								error: err
							});
						} else if (!app) {
							return res.send(400, 'Bad request');
						}

						res.send(200);
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
				Application.findOne(req.body.pk, function (err, app) {

					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!app) {
						return res.send(400, 'Bad request');
					}

					app.remove(function (err, app) {

						if (err) {
							return res.send(500, {
								error: err
							});
						} else if (!app) {
							return res.send(400, 'Bad request');
						}

						res.send(200);
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
		}
	};

	module.exports = API;
})(module);
