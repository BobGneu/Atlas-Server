var models = require("./atlas.models"),
	Application = models.Application,
	form = require("express-form"),
	filter = form.filter,
	validate = form.validate;

API = {
	paramLookup: function (req, res, next, id) {
		models.Application.find({
			id: models.ObjectId(id)
		}, function (err, app) {

			if (err) {
				return next(err);
			} else if (!application) {
				return next(new Error('failed to load application'));
			}

			req.application = app;
			next();
		});
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
		validate("allowGame").required(),
		validate("allowEditor").required()
	),
	create: function (req, res) {
		//form needs to be validated.
		var tmp = new Application({
			Name: req.form.name,
			AllowGame: req.form.allowGame,
			AllowEditor: req.form.allowEditor
		});

		tmp.save(function (err, application) {
			res.redirect('/applications/' + application._id);
		});
	},
	read: function (req, res) {
		Application.findOne({
			_id: models.ObjectId(req.params.applicationId)
		}, function (err, application) {

			res.render('applications/read', {
				application: application
			});
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