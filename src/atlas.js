API = {
	index: function (req, res) {
		res.render('atlas/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	login: function (req, res) {
		res.render('atlas/login', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	overview: function (req, res) {
		res.render('atlas/overview', {
			userAuthenticated: req.isAuthenticated()
		});
	}
};

module.exports = API;