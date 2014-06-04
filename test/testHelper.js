var randomInt = function (low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

exports = {
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