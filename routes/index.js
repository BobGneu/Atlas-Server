var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	res.render('general/index');
});

router.get('/login', function (req, res) {
	res.render('general/index');
});

router.get('/tracking', function (req, res) {
	res.redirect('/login');
});

router.get('/applications', function (req, res) {
	res.redirect('/login');
});

router.get('/clients', function (req, res) {
	res.redirect('/login');
});

router.get('/users', function (req, res) {
	res.redirect('/login');
});

router.get('/overview', function (req, res) {
	res.redirect('/login');
});

module.exports = router;