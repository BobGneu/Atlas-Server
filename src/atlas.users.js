API = {
	index: function (req, res) {
		res.render('users/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	create: function (req, res) {
		res.redirect('users');
	},
	read: function (req, res) {
		res.render('general/read', {
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

		// Only administrators are allowed to access the users page
		if (req.route.path === '/users') {
			if (req.user.Role === 'Administrator') {
				return next();
			} else {
				return res.redirect("/overview");
			}
		}

		// Otherwise you are fine
		next();
	}
};

module.exports = API;