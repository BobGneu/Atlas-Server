var Report = require("./atlas.models").Report,
	form = require("express-form"),
	filter = form.filter,
	validate = form.validate;

API = {
	paramLookup: function (req, res, next, id) {
		models.Tracking.find({
			id: models.ObjectId(id)
		}, function (err, report) {

			console.log(report);

			if (err) {
				return next(err);
			} else if (!report) {
				return next(new Error('failed to load report'));
			}

			req.report = report;
			next();
		});
	},
	index: function (req, res) {
		res.render('tracking/index');
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