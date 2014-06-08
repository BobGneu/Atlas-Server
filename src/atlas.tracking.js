var Report = require("./atlas.models").Report,
	form = require("express-form"),
	filter = form.filter,
	validate = form.validate;

API = {
	index: function (req, res) {
		res.render('tracking/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	createValidation: form(
		filter("name").trim(),
		validate("name").required()
	),
	create: function (req, res, next) {

		// Form needs to be checked to ensure that this is a valid submission.

		var tmp = new Report({
			Name: req.form.name
		});

		tmp.save(function (err, report) {
			res.render('tracking/read', {
				userAuthenticated: req.isAuthenticated(),
				report: {
					title: report.Name
				}
			});
		});
	},
	read: function (req, res) {
		res.render('tracking/read', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	update: function (req, res) {
		res.redirect('/tracking');
	},
	delete: function (req, res) {
		res.redirect('/tracking');
	}
};

module.exports = API;