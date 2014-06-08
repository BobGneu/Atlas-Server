API = {
	index: function (req, res) {
		res.render('tracking/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	create: function (req, res) {
		res.redirect('/tracking');
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