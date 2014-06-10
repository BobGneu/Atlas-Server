API = {
	index: function (req, res) {
		res.render('atlas/index');
	},
	login: function (req, res) {
		res.render('atlas/login');
	},
	logout: function (req, res) {
		req.session.destroy(function () {
			res.redirect('/');
		});
	},
	overview: function (req, res) {
		console.log("overview");
		res.render('atlas/overview');
	}
};

module.exports = API;