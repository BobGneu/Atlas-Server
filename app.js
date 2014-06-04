var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var package = require('./package.json');
var responseTime = require('response-time');
var session = require('express-session');

var routes = require('./routes/index');
var admin = require('./routes/admin');
var tracking = require('./routes/tracking');
var db = require("./src/db");
var expressLayouts = require('express-ejs-layouts')

var app = express();

var helpers = require('express-helpers');
helpers(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

app.use(responseTime());
app.use(favicon());
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
	secret: 'keyboard cat',
	cookie: {
		maxAge: 60000
	}
}));

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.locals.title = 'Atlas';
app.locals.version = package.version;

app.use('/', routes);
app.use('/admin', admin);
app.use('/tracking', tracking);

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

if (app.get('env') === 'development') {
	app.set('port', process.env.PORT || 3000);
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('general/error', {
			message: err.message,
			error: err
		});
	});
} else if (app.get('env') === 'testing') {
	app.set('port', process.env.PORT || 3001);
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('general/error', {
			message: err.message,
			error: err
		});
	});
} else {
	app.set('port', process.env.PORT || 8080);
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('general/error', {
			message: err.message,
			error: {}
		});
	});
}

module.exports = app;