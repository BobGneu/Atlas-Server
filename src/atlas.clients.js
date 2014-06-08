API = {
	index: function (req, res) {
		res.render('clients/index', {
			userAuthenticated: req.isAuthenticated()
		});
	},
	create: function (req, res) {
		res.redirect('/clients');
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