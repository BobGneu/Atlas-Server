var User = require("./atlas.models").User,
	form = require("express-form"),
	filter = form.filter,
	validate = form.validate,
	passwordHash = require('password-hash');

API = {
	index: function (req, res) {
		res.render('users/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	createValidation: form(
		filter("name").trim(),
		validate("name").required(),
		filter("email").trim(),
		validate("email").isEmail().required(),
		filter("password").trim(),
		validate("password").required(),
		filter("password-conf").trim(),
		validate("password-conf").equals("field::password"),
		filter("role").trim(),
		validate("role").required()
	),
	create: function (req, res) {

		// Form needs to be checked to ensure that this is a valid submission.

		var tmp = new User({
			Name: req.form.name,
			Email: req.form.email,
			PasswordHash: passwordHash.generate(req.form.password),
			Role: req.form.role,
		});

		tmp.save(function (err, user) {

			res.render('users/read', {
				userAuthenticated: req.isAuthenticated(),
				user: {
					name: user.Name,
					email: user.Email,
					role: user.Role
				}
			});
		});
	},
	read: function (req, res) {
		res.render('users/read', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	update: function (req, res) {
		res.redirect('users');
	},
	delete: function (req, res) {
		res.redirect('users');
	},
	restricted: function (req, res, next) {
		// Unauthenticated users get redirected to the login page
		if (!req.isAuthenticated())
			return res.redirect('/login');

		/*/ Only administrators are allowed to access the users page
		if (req.route.path === '/users') {
			if (req.user.Role === 'Administrator') {
				return next();
			} else {
				return res.redirect("/overview");
			}
		}*/

		// Otherwise you are fine
		next();
	}
};

module.exports = API;