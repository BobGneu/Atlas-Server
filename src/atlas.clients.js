var models = require("./atlas.models"),
	client = models.Client,
	form = require("express-form"),
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
				next(new Error("Invalid Client ID"));
			} else {
				res.redirect("/login");
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
		filter("uid").trim(),
		filter("allowGame").trim(),
		filter("allowEditor").trim(),
		validate("uid").required(),
		validate("allowGame"),
		validate("allowEditor")
	),
	create: function (req, res) {
		if (req.form.isValid) {
			var tmp = new client({
				UID: req.form.uid,
				AllowGame: req.form.allowGame,
				AllowEditor: req.form.allowEditor
			});

			tmp.save(function (err, client) {
				res.redirect("/clients/" + client._id);
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