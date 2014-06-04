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
	Table2Object: function (browser, id) {
		var keysIndex = [];
		var result = {
			found: false
		};

		var table = browser.document.getElementById("user-table");
		if (typeof (table) === 'undefined' || table === null) {
			return result;
		}

		result.found = true;
		tbody = table.childNodes[1];

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