API = {
	index: function (req, res) {
		res.render('applications/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	create: function (req, res) {
		res.redirect('/applications');
	},
	read: function (req, res) {
		res.render('applications/read', {
			userAuthenticated: req.isAuthenticated()
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