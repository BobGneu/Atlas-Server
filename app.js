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

require('express-helpers')(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);

app.use(responseTime());
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({
	secret: 'atlas',
	cookie: {
		secure: true,
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

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		res.render('general/error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	res.render('general/error', {
		message: err.message,
		error: {}
	});
});

module.exports = app;