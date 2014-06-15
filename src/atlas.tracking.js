var models = require("./atlas.models"),
	form = require("express-form"),
	uuid = require('node-uuid'),
	report = models.Report,
	filter = form.filter,
	validate = form.validate;

API = {
	paramLookup: function (req, res, next, id) {
		try {
			report.findOne({
				_id: models.ObjectId(id)
			}, function (err, report) {

				if (err) {
					return next(err);
				} else if (!report) {
					return next(new Error('failed to load Client'));
				}
				req.params.report = report;
				next();
			});
		} catch (e) {
			if (req.isAuthenticated()) {
				next(new Error("Invalid Client ID"));
			} else {
				res.redirect("/login");
				next();
			}
		}
	},
	index: function (req, res) {
		report.find({}, function (err, reports) {
			res.render('tracking/index', {
				reports: reports
			});
		});
	},
	createValidation: form(
		filter("name").trim(),
		validate("name").required()
	),
	create: function (req, res, next) {
		if (req.form.isValid) {
			var tmp = new report({
				Name: req.form.name
			});

			tmp.save(function (err, report) {
				res.redirect("/tracking/" + report._id);
			});
		} else {
			req.session.messages = req.form.errors;
			req.failed();
		}
	},
	read: function (req, res) {
		res.render('tracking/read', {
			report: req.params.report
		});
	},
	update: function (req, res) {
		res.redirect('/tracking');
	},
	delete: function (req, res) {
		try {
			models.Report.findOne({
				_id: models.ObjectId(req.body.pk)
			}, function (err, report) {

				if (err) {
					return res.send(500, {
						error: err
					});
				} else if (!report) {
					return res.send(400, 'Bad request');
				}

				report.remove(function (err, report) {

					if (err) {
						return res.send(500, {
							error: err
						});
					} else if (!report) {
						return res.send(400, 'Bad request2');
					}

					res.send(200);
				});
			});
		} catch (e) {
			if (req.isAuthenticated()) {
				res.send(400, 'Bad request3');
			} else {
				res.redirect("/login");
			}
			next();
		}
	},
	paramBoolLookup: function (req, res, next, id) {
		req.params.private = id === 'true';

		next();
	},
	paramNameLookup: function (req, res, next, id) {
		models.Application.findOne({
			Name: id
		}, function (err, app) {
			if (err || typeof app === "undefined") {
				req.params.application = {
					found: false
				};
			} else {
				req.params.application = app;
				req.params.application.found = true;
			}
			next();
		});
	},
	paramSessionLookup: function (req, res, next, id) {
		next();
	},
	authUser: function (req, res) {
		var response = {
			AllowGame: false,
			AllowEditor: false,
			SessionID: uuid.v1()
		};

		if (req.params.application.found) {
			response.AllowGame = req.params.application.AllowGame;
			response.AllowEditor = req.params.application.AllowEditor;

			if (req.params.client.found) {
				response.AllowGame = req.params.client.AllowGame;
				response.AllowEditor = req.params.client.AllowEditor;

				req.params.client.LastLogin = Date.now();
				req.params.client.LastIP = req.ip;
				req.params.client.LastApplication = req.params.application.Name;
				req.params.client.Auths++;
				req.params.client.SessionID = response.SessionID;

				req.params.client.save(function (err, client) {
					res.json(response);
				})
			} else {
				var tmp = new models.Client({
					UID: req.params.client.UID,
					AllowGame: response.AllowGame,
					AllowEditor: response.AllowEditor,
					LastLogin: Date.now(),
					LastIP: req.ip,
					LastApplication: req.params.application.Name,
					SessionID: response.SessionID
				});

				tmp.save(function (err, client) {
					res.json(response);
				});
			}
		}
	},
	paramEventName: function (req, res, next, id) {
		next();
	},
	event: function (req, res) {

		var UA = req.headers["user-agent"].split(" ");

		var ev = models.Event({
			SessionID: req.params.sessionID,
			ApplicationID: req.params.application._id,
			Version: UA[1],
			Platform: UA[2],
			Name: req.params.eventName,
			Data: req.body
		});

		ev.save(function (err, ev) {
			res.json({});
		});
	}
};

module.exports = API;