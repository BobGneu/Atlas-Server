(function (module) {
	'use strict';

	var express = require('express');
	var path = require('path');
	var favicon = require('static-favicon');
	var cookieParser = require('cookie-parser');
	var bodyParser = require('body-parser');
	var pkg = require('./package.json');
	var responseTime = require('response-time');
	var session = require('express-session');
	var passport = require('passport');
	var LocalStrategy = require('passport-local').Strategy;
	var swig = require('swig');
	var sass = require('node-sass');

	var models = require('./src/atlas.models.js');

	var routes = require('./routes/index');

	var app = express();

	// view engine setup
	app.set('views', path.join(__dirname, 'views'));
	app.engine('html', swig.renderFile);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	app.set('view cache', false);

	swig.setDefaults({
		cache: false
	});

	swig.setDefaults({
		loader: swig.loaders.fs(__dirname + '/views/layouts')
	});

	app.use(responseTime(5));
	app.use(favicon());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());
	app.use(cookieParser());
	app.use(session({
		secret: 'atlas is a greek god.'
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(sass.middleware({
		src: path.join(__dirname, 'public'),
		dest: path.join(__dirname, 'public'),
		outputStyle: 'compressed',
		prefix: '/prefix'
	}));
	app.use(express.static(path.join(__dirname, 'public')));

	app.locals.title = 'Atlas';
	app.locals.version = pkg.version;

	app.use(function (req, res, next) {

		res.locals.userAuthenticated = req.isAuthenticated();
		res.locals.currentPage = req.url;
		res.locals.user = req.user;
		res.locals.isAdministrator = (typeof req.user !== 'undefined') && (typeof req.user.Role !==
			'undefined') && req.user.Role === 'Administrator';
		res.locals.messages = req.session.messages;

		req.failed = function () {
			if (req.isAuthenticated()) {
				res.redirect('back');
			} else {
				res.redirect('/login');
			}
		};

		next();
	});

	app.use('/', routes);

	/// catch 404 and forward to error handler
	app.use(function (req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

	passport.use(new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password'
	}, function (username, password, done) {

		models.User.findOne({
			Name: username.toLowerCase()
		}, function (err, user) {

			if (err) {
				return done(err);
			}
			if (!user) {
				return done(null, false, {
					message: 'Incorrect username.'
				});
			}
			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect password.'
				});
			}

			user.completeLogin();

			return done(null, user);
		});
	}));

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		models.User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	/// error handlers

	if (app.get('env') === 'production') {
		app.set('port', process.env.PORT || 8080);
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: {}
			});
		});
	} else if (app.get('env') === 'testing') {
		app.set('port', process.env.PORT || 3001);
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	} else {
		app.set('port', process.env.PORT || 3000);
		app.use(function (err, req, res, next) {
			res.status(err.status || 500);
			res.render('error', {
				message: err.message,
				error: err
			});
		});
	}

	module.exports = app;

})(module);
