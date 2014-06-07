var router = require('express').Router(),
	passport = require("passport");

var restricted = function (req, res, next) {
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
};

router.get('/', function (req, res) {
	res.render('index');
});

router.get('/login', function (req, res) {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/overview',
	failureRedirect: '/login'
}));

router.get('/tracking', restricted, function (req, res) {
	res.render('general/index');
});

router.get('/applications', restricted, function (req, res) {
	res.render('general/index');
});

router.get('/clients', restricted, function (req, res) {
	res.render('general/index');
});

router.get('/users', restricted, function (req, res) {
	res.render('general/index');
});

router.get('/overview', restricted, function (req, res) {
	res.render('general/index');
});

module.exports = router;