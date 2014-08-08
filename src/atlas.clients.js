(function (module) {
	'use strict';
	var models = require('./atlas.models'),
		Client = models.Client,
		form = require('express-form'),
		filter = form.filter,
		validate = form.validate;

	API = {
		paramLookup: function (req, res, next, id) {
			try {
				client.findOne({
					_id: models.ObjectId(id)
				}, function (err, client) {

					if (err) {
						return next(err);
					} else if (!client) {
						return next(new Error('failed to load Client'));
					}
					req.params.client = client;
					next();
				});
			} catch (e) {
				if (req.isAuthenticated()) {
					next(new Error('Invalid Client ID'));
				} else {
					res.redirect('/login');
					next();
				}
			}
		},
		index: function (req, res) {
			client.find({}, function (err, clients) {
				res.render('clients/index', {
					clients: clients
				});
			});
		},
		createValidation: form(
			filter('uid').trim(),
			filter('allowGame').trim(),
			filter('allowEditor').trim(),
			validate('uid').required(),
			validate('allowGame'),
			validate('allowEditor')
		),
		create: function (req, res) {
			if (req.form.isValid) {
				var tmp = new Client({
					UID: req.form.uid,
					AllowGame: req.form.allowGame,
					AllowEditor: req.form.allowEditor
				});

				tmp.save(function (err, client) {
					res.redirect('/clients/' + client._id);
				});
			} else {
				req.session.messages = req.form.errors;
				req.failed();
			}
		},
		read: function (req, res) {
			res.render('clients/read', {
				client: req.params.client
			});
		},
		update: function (req, res) {
			try {
				models.Client.findOne({
					_id: models.ObjectId(req.body.pk)
				}, function (err, Client) {
					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!Client) {
						return res.send(400, 'Bad request');
					}

					if (req.body.name === 'AllowGame') {
						Client.AllowGame = req.body.value === 'True';
					} else if (req.body.name === 'AllowEditor') {
						Client.AllowEditor = req.body.value === 'True';
					}

					Client.save(function (err, Client) {

						if (err) {
							return res.send(500, {
								error: err
							});
						} else if (!Client) {
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
				models.Client.findOne({
					_id: models.ObjectId(req.body.pk)
				}, function (err, client) {

					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!client) {
						return res.send(400, 'Bad request');
					}

					Client.remove(function (err, client) {

						if (err) {
							return res.send(500, {
								error: err
							});
						} else if (!client) {
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
		paramNameLookup: function (req, res, next, id) {
			models.Client.findOne({
				UID: id
			}, function (err, client) {
				if (err || typeof client === 'undefined' || client === null) {
					req.params.client = {
						found: false,
						UID: id
					};
				} else {
					req.params.client = client;
					req.params.client.found = true;
				}
				next();
			});
		}
	};

	module.exports = API;
})(module);
