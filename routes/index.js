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
router.get('/overview', restricted, atlas.overview);

router.post('/login', passport.authenticate('local', {
	successRedirect: '/overview',
	failureRedirect: '/login'
}));

router.get('/tracking', restricted, tracking.index);
router.post('/tracking/create', restricted, tracking.create);
router.get('/tracking/:id', restricted, tracking.read);
router.put('/tracking/update/:id', restricted, tracking.update);
router.delete('/tracking/delete/:id', restricted, tracking.delete);

router.get('/applications', restricted, applications.index);

router.post('/applications/create', restricted, applications.create);
router.get('/applications/:id', restricted, applications.read);
router.put('/applications/update/:id', restricted, applications.update);
router.put('/applications/updateSecurity/:id', restricted, applications.updateSecurity);
router.delete('/applications/delete/:id', restricted, applications.delete);

router.get('/clients', restricted, clients.index);

router.post('/clients/create', restricted, clients.create);
router.get('/clients/:id', restricted, clients.read);
router.put('/clients/update/:id', restricted, clients.update);
router.put('/clients/updateSecurity/:id', restricted, clients.updateSecurity);
router.delete('/clients/purge/:id', restricted, clients.purge);
router.delete('/clients/delete/:id', restricted, clients.delete);

router.get('/users', restricted, users.index);

router.post('/users/create', restricted, users.create);
router.get('/users/:id', restricted, users.read);
router.put('/users/update/:id', restricted, users.update);
router.delete('/users/delete/:id', restricted, users.delete);

module.exports = router;