API = {
	index: function (req, res) {
		res.render('atlas/index');
	},
	login: function (req, res) {
		res.render('atlas/login');
	},
	overview: function (req, res) {
		res.render('atlas/overview');
	}
};
module.exports = API;