var Browser = require("zombie");
var should = require("should");

var helper = require('./testHelper');

describe('Eventing & Tracking', function () {

	var browser = {};

	before(function (done) {
		this.server = helper.startServer(done);
	});

	after(function (done) {
		this.server.close(done);
	});

	beforeEach(function (done) {});

	describe("EVENT", function () {});

	describe("AUTH", function () {});
});