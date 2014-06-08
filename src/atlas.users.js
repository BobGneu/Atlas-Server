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
	}
};

module.exports = API;