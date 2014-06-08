var router = require('express').Router(),
	passport = require("passport"),
	atlas = require("../src/atlas"),
	users = require("../src/atlas.users"),
	clients = require("../src/atlas.clients"),
	applications = require("../src/atlas.applications"),
	tracking = require("../src/atlas.tracking");

router.param(":id", function (req, res, next, id) {
	next();
});

router.get('/', atlas.index);
router.get('/login', atlas.login);
router.get('/overview', users.restricted, atlas.overview);

router.post('/login', passport.authenticate('local', {
	successRedirect: '/overview',
	failureRedirect: '/login'
}));

router.get('/tracking', users.restricted, tracking.index);
router.post('/tracking/create', users.restricted, tracking.createValidation, tracking.create);
router.get('/tracking/:id', users.restricted, tracking.read);
router.put('/tracking/update/:id', users.restricted, tracking.update);
router.delete('/tracking/delete/:id', users.restricted, tracking.delete);

router.get('/applications', users.restricted, applications.index);

router.post('/applications/create', users.restricted, applications.createValidation, applications.create);
router.get('/applications/:id', users.restricted, applications.read);
router.put('/applications/update/:id', users.restricted, applications.update);
router.put('/applications/updateSecurity/:id', users.restricted, applications.updateSecurity);
router.delete('/applications/delete/:id', users.restricted, applications.delete);

router.get('/clients', users.restricted, clients.index);

router.post('/clients/create', users.restricted, clients.createValidation, clients.create);
router.get('/clients/:id', users.restricted, clients.read);
router.put('/clients/update/:id', users.restricted, clients.update);
router.put('/clients/updateSecurity/:id', users.restricted, clients.updateSecurity);
router.delete('/clients/purge/:id', users.restricted, clients.purge);
router.delete('/clients/delete/:id', users.restricted, clients.delete);

router.get('/users', users.restricted, users.index);

router.post('/users/create', users.restricted, users.create);
router.get('/users/:id', users.restricted, users.read);
router.put('/users/update/:id', users.restricted, users.update);
router.delete('/users/delete/:id', users.restricted, users.delete);

module.exports = router;