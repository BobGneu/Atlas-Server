var router = require('express').Router(),
	passport = require("passport"),
	atlas = require("../src/atlas"),
	users = require("../src/atlas.users"),
	clients = require("../src/atlas.clients"),
	applications = require("../src/atlas.applications"),
	tracking = require("../src/atlas.tracking");

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

router.param(":id", function (req, res, next, id) {
	next();
});

router.get('/', atlas.index);
router.get('/login', atlas.login);
router.post('/login', passport.authenticate('local', {
	successRedirect: '/overview',
	failureRedirect: '/login'
}));

router.get('/tracking', restricted, tracking.index);
router.post('/tracking/report/create', restricted, tracking.create);
router.get('/tracking/report/:id', restricted, tracking.read);
router.put('/tracking/report/update/:id', restricted, tracking.update);
router.delete('/tracking/report/delete/:id', restricted, tracking.delete);

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