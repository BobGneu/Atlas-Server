var app = require('../app');
var pkg = require("../package.json");
var models = require('../src/atlas.models.js');
var async = require('async');
var passwordHash = require('password-hash');
var should = require("should");

var randomInt = function (low, high) {
	return Math.floor(Math.random() * (high - low) + low);
};

exports = {
	pkg: pkg,
	getPort: function () {
		return app.get('port');
	},
	getVersion: function () {
		return pkg.version;
	},
	startServer: function (done) {
		return app.listen(app.get('port'), done);
	},
	createManager: function (user, pass, done) {
		var user = new models.User({
			Name: user,
			Email: user + "@gneu.org",
			Role: "Manager",
			PasswordHash: passwordHash.generate(pass)
		});

		user.save(function (err, user) {
			(err === null).should.be.true;

			done();
		});
	},
	createAdmin: function (user, pass, done) {
		var user = new models.User({
			Name: user,
			Email: user + "@gneu.org",
			Role: "Administrator",
			PasswordHash: passwordHash.generate(pass)
		});

		user.save(function (err, user) {
			(err === null).should.be.true;

			done();
		});
	},
	createSampleApplications: function (n, done) {
		var that = this;
		var app = {};

		if (n <= 0) {
			return done();
		}

		app = new models.Application({
			Name: "application " + n
		});

		app.save(function (err, app) {
			should.not.exist(err);

			that.createSampleApplications(n - 1, done);
		});
	},
	createSampleClients: function (n, done) {
		var that = this;
		var app = {};

		if (n <= 0) {
			return done();
		}

		app = new models.Client({
			UID: "client " + n
		});

		app.save(function (err, app) {
			(err === null).should.be.true;

			that.createSampleClients(n - 1, done);
		});
	},
	createSampleReports: function (n, done) {
		var that = this;
		var app = {};

		if (n <= 0) {
			return done();
		}

		app = new models.Report({
			Name: "report " + n
		});

		app.save(function (err, app) {
			(err === null).should.be.true;

			that.createSampleReports(n - 1, done);
		});
	},
	InitializeDatabase: function (done) {

		async.series([

			function (cb) {
				models.User.remove({}, function (err, docs) {
					models.User.count({}, function (err, docs) {
						docs.should.eql(0);
						(err === null).should.be.true;
						cb();
					});
				});
			},
			function (cb) {
				models.Application.remove({}, function (err, docs) {
					models.Application.count({}, function (err, docs) {
						docs.should.eql(0);
						(err === null).should.be.true;
						cb();
					});
				});
			},
			function (cb) {
				models.TrackingData.remove({}, function (err, docs) {
					models.TrackingData.count({}, function (err, docs) {
						docs.should.eql(0);
						(err === null).should.be.true;
						cb();
					});
				});
			},
			function (cb) {
				models.Report.remove({}, function (err, docs) {
					models.Report.count({}, function (err, docs) {
						docs.should.eql(0);
						(err === null).should.be.true;
						cb();
					});
				});
			},
			function (cb) {
				models.Client.remove({}, function (err, docs) {
					models.Report.count({}, function (err, docs) {
						docs.should.eql(0);
						(err === null).should.be.true;
						cb();
					});
				});
			},
		], done);
	},
	Table2Object: function (browser, id) {
		var keysIndex = [];
		var result = {
			found: false
		};

		var table = browser.document.getElementById(id);

		if (typeof (table) === 'undefined' || table === null) {
			return result;
		}

		result.found = true;

		tbody = table.childNodes[0];

		// build keys from header row
		for (var i = 0; i < tbody.childNodes[0].childNodes.length; i++) {
			var key = tbody.childNodes[0].childNodes[i].textContent;

			key = key.trim();

			if (key.length === 0) {
				continue;
			};

			result[key.toLowerCase()] = [];
		}

		// build keys from header row
		for (var i = 0; i < tbody.childNodes[0].childNodes.length; i++) {
			var key = tbody.childNodes[0].childNodes[i].textContent;

			key = key.trim();

			keysIndex.push(key.toLowerCase());

			if (key.length === 0) {
				continue;
			};

			result[key.toLowerCase()] = [];
		}

		// populate lists from the rest of the table

		// build keys from header row
		for (var i = 1; i < tbody.childNodes.length; i++) {
			for (var j = 0; j < tbody.childNodes[i].childNodes.length; j++) {
				var value = tbody.childNodes[i].childNodes[j].textContent;

				value = value.trim();

				if (value.length === 0) {
					continue;
				};

				result[keysIndex[j]].push(value);
			}
		}

		return result;
	},
	generate: {
		username: function (pfx) {
			var prefix = pfx || "user_";

			return prefix + "" + randomInt(10000000, 100000000);
		},
		uid: function () {
			return "" + randomInt(10000000, 100000000);
		},
		email: function (username) {
			return username + "@gmail.com";
		}
	}
};

module.exports = exports;