var models = require("./atlas.models"),
	Application = models.Application,
	form = require("express-form"),
	filter = form.filter,
	validate = form.validate;

API = {
	paramLookup: function (req, res, next, id) {
		try {
			models.Application.findOne({
				_id: models.ObjectId(id)
			}, function (err, app) {

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
				next(new Error("Invalid Application ID"));
			} else {
				res.redirect("/login");
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
		filter("name").trim(),
		validate("name").required(),
		filter("allowGame").trim(),
		filter("allowEditor").trim(),
		validate("allowGame"),
		validate("allowEditor")
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
		res.redirect('/applications');
	},
	updateSecurity: function (req, res) {
		res.redirect('/applications');
	},
	delete: function (req, res) {
		res.redirect('/applications');
	}
};

module.exports = API;