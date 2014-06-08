var Client = require("./atlas.models").Client,
	form = require("express-form"),
	filter = form.filter,
	validate = form.validate;

API = {
	index: function (req, res) {
		res.render('clients/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	createValidation: form(
		filter("uid").trim(),
		filter("allowGame").trim(),
		filter("allowEditor").trim(),
		validate("uid").required(),
		validate("allowGame").required(),
		validate("allowEditor").required()
	),
	create: function (req, res) {
		//form needs to be validated.
		var tmp = new Client({
			UID: req.form.uid,
			AllowGame: req.form.allowGame,
			AllowEditor: req.form.allowEditor
		});

		tmp.save(function (err, client) {
			res.render('clients/read', {
				userAuthenticated: req.isAuthenticated(),
				client: {
					uid: client.UID,
					allowGame: client.AllowGame,
					allowEditor: client.AllowEditor,
				}
			});
		});
	},
	read: function (req, res) {
		res.render('clients/read', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	update: function (req, res) {
		res.redirect('/clients');
	},
	delete: function (req, res) {
		res.redirect('/clients');
	},
	updateSecurity: function (req, res) {
		res.redirect('/clients');
	},
	purge: function (req, res) {
		res.redirect('/clients');
	}
};

module.exports = API;