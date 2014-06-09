var Application = require("./atlas.models").Application,
	form = require("express-form"),
	filter = form.filter,
	validate = form.validate;

API = {
	index: function (req, res) {
		res.render('applications/index');
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
			res.render('applications/read', {
				application: {
					name: application.Name,
					allowGame: application.AllowGame,
					allowEditor: application.AllowEditor,
				}
			});
		});
	},
	read: function (req, res) {
		res.render('applications/read');
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