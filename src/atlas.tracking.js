var models = require("./atlas.models"),
	report = models.Report,
	form = require("express-form"),
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
				} else if (!client) {
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

		// Form needs to be checked to ensure that this is a valid submission.

		var tmp = new report({
			Name: req.form.name
		});

		tmp.save(function (err, report) {
			res.render('tracking/read', {
				report: {
					title: report.Name
				}
			});
		});
	},
	read: function (req, res) {
		res.render('tracking/read');
	},
	update: function (req, res) {
		res.redirect('/tracking');
	},
	delete: function (req, res) {
		res.redirect('/tracking');
	}
};

module.exports = API;