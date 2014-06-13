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
router.param(":appName", tracking.paramNameLookup);
router.param(":userName", clients.paramNameLookup);
router.param(":sessionID", tracking.paramSessionLookup);
router.param(":private", tracking.paramBoolLookup);

router.get('/', atlas.index);
router.get('/login', atlas.login);
router.get('/logout', atlas.logout);
router.get('/overview', users.restricted, atlas.overview);

router.post('/login', passport.authenticate('local', {
	successRedirect: '/overview',
	failureRedirect: '/login'
}));

router.get('/tracking', users.restricted, tracking.index);
router.get('/tracking/:reportId', users.restricted, tracking.read);
router.post('/tracking', users.restricted, tracking.createValidation, tracking.create);
router.put('/tracking', users.restricted, tracking.update);
router.delete('/tracking', users.restricted, tracking.delete);

router.get("/auth/:appName/:userName/:private", tracking.authUser);
router.post("/event/:appName/:sessionID", tracking.event);

router.get('/applications', users.restricted, applications.index);
router.get('/applications/:applicationId', users.restricted, applications.read);
router.post('/applications', users.restricted, applications.createValidation, applications.create);
router.put('/applications', users.restricted, applications.update);
router.delete('/applications', users.restricted, applications.delete);

router.get('/clients', users.restricted, clients.index);
router.get('/clients/:clientId', users.restricted, clients.read);
router.post('/clients', users.restricted, clients.createValidation, clients.create);
router.put('/clients', users.restricted, clients.update);
router.delete('/clients', users.restricted, clients.delete);

router.get('/users', users.restricted, users.index);
router.get('/users/:userId', users.restricted, users.read);
router.post('/users', users.restricted, users.createValidation, users.create);
router.put('/users', users.restricted, users.update);
router.delete('/users', users.restricted, users.delete);

module.exports = router;