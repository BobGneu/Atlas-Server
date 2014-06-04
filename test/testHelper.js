var debug = require('debug')('atlas-server');
var app = require('../app');
var pkg = require("../package.json");

var randomInt = function (low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

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
	generate: {
		username: function (pfx) {
			var prefix = pfx || "user.";

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