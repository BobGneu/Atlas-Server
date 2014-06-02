var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {

	console.log(req.headers.host);

	res.render('admin/login', {
		layout: 'admin'
	});
});

router.get('/logout', function (req, res) {
	req.session.destroy();
	res.redirect('/');
});

router.get('/overview', function (req, res) {
	res.render('admin/overview', {
		layout: 'admin'
	});
});

router.get('/tracking', function (req, res) {
	res.render('admin/tracking', {
		layout: 'admin'
	});
});

router.get('/users', function (req, res) {
	res.render('admin/users', {
		layout: 'admin'
	});
});

router.post('/users', function (req, res) {
	res.redirect("/admin/users");
});

router.post('/', function (req, res) {
	res.redirect("/admin/overview");
});

module.exports = router;