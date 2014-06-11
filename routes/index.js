var router = require('express').Router(),
	passport = require("passport"),
	atlas = require("../src/atlas"),
	users = require("../src/atlas.users"),
	clients = require("../src/atlas.clients"),
	applications = require("../src/atlas.applications"),
	tracking = require("../src/atlas.tracking");

router.param(":userId", users.paramLookup);
router.param(":clientId", clients.paramLookup);
router.param(":applicationId", applications.paramLookup);
router.param(":reportId", tracking.paramLookup);

router.get('/', atlas.index);
router.get('/login', atlas.login);
router.get('/logout', atlas.logout);
router.get('/overview', users.restricted, atlas.overview);

router.post('/login', passport.authenticate('local', {
	successRedirect: '/overview',
	failureRedirect: '/login'
}));

router.get('/tracking', users.restricted, tracking.index);
router.post('/tracking/create', users.restricted, tracking.createValidation, tracking.create);
router.get('/tracking/:reportId', users.restricted, tracking.read);
router.put('/tracking/update/:reportId', users.restricted, tracking.update);
router.delete('/tracking/delete/:reportId', users.restricted, tracking.delete);

router.get('/applications', users.restricted, applications.index);

router.post('/applications/create', users.restricted, applications.createValidation, applications.create);
router.get('/applications/:applicationId', users.restricted, applications.read);
router.put('/applications/update/:applicationId', users.restricted, applications.update);
router.put('/applications/updateSecurity/:applicationId', users.restricted, applications.updateSecurity);
router.delete('/applications/delete/:applicationId', users.restricted, applications.delete);

router.get('/clients', users.restricted, clients.index);

router.post('/clients/create', users.restricted, clients.createValidation, clients.create);
router.get('/clients/:clientId', users.restricted, clients.read);
router.put('/clients/update/:clientId', users.restricted, clients.update);
router.put('/clients/updateSecurity/:clientId', users.restricted, clients.updateSecurity);
router.delete('/clients/purge/:clientId', users.restricted, clients.purge);
router.delete('/clients/delete/:clientId', users.restricted, clients.delete);

router.get('/users', users.restricted, users.index);

router.post('/users/create', users.restricted, users.createValidation, users.create);
router.get('/users/:userId', users.restricted, users.read);
router.put('/users/update/:userId', users.restricted, users.update);
router.delete('/users/delete/:userId', users.restricted, users.delete);

module.exports = router;