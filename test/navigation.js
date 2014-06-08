var Browser = require("zombie"),
	should = require("should"),
	async = require("async");

var helper = require('./testHelper');

describe('Navigation', function () {

	var browser = {};

	before(function (done) {
		this.server = helper.startServer(function () {
			helper.InitializeDatabase(done);
		});
	});

	after(function (done) {
		this.server.close(done);
	});

	describe("Unauthenticated User", function () {
		before(function (done) {
			browser = new Browser({});
			browser.visit("http://localhost:" + helper.getPort(), function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/");

				done();
			});
		});

		describe("Menu", function () {
			it("should have a link to Home", function () {
				should.exist(browser.document.getElementById("nav-home"));
			});

			it("should have a link to Login", function () {
				should.exist(browser.document.getElementById("nav-login"));
			});

			it("should not have a link to Tracking", function () {
				should.not.exist(browser.document.getElementById("nav-tracking"));
			});

			it("should not have a link to Applications", function () {
				should.not.exist(browser.document.getElementById("nav-applications"));
			});

			it("should not have a link to Clients", function () {
				should.not.exist(browser.document.getElementById("nav-clients"));
			});

			it("should not have a link to Users", function () {
				should.not.exist(browser.document.getElementById("nav-users"));
			});
		});
	});

	describe("Manager", function () {
		before(function (done) {
			browser = new Browser({});
			async.series([

				function (cb) {
					helper.createAdmin("testManager", "testManager", cb);
				},
				function (cb) {
					browser.visit("http://localhost:" + helper.getPort(), function () {
						cb();
					});
				},
				function (cb) {
					browser.success.should.be.true;
					browser.window.location.pathname.should.eql("/");

					browser.clickLink("Login", function () {
						cb();
					});
				},
				function (cb) {
					browser.window.location.pathname.should.endWith("/login");
					browser.fill("username", "testManager").fill("password", "testManager").pressButton("Login", function () {
						cb();
					})
				}
			], done);
		});

		describe("Menu", function () {
			it("should have a link to Home", function () {
				should.exist(browser.document.getElementById("nav-home"));
			});

			it("should have a link to Tracking", function () {
				should.exist(browser.document.getElementById("nav-tracking"));
			});

			it("should have a link to Applications", function () {
				should.exist(browser.document.getElementById("nav-applications"));
			});

			it("should have a link to Clients", function () {
				should.exist(browser.document.getElementById("nav-clients"));
			});

			it("should have a link to Users", function () {
				should.exist(browser.document.getElementById("nav-users"));
			});

			it("should not have a link to Login", function () {
				should.exist(browser.document.getElementById("nav-logout"));
			});

			it("should not have a link to Login", function () {
				should.not.exist(browser.document.getElementById("nav-login"));
			});
		});
	});

	describe("Administrator", function () {
		before(function (done) {
			browser = new Browser({});
			async.series([

				function (cb) {
					helper.createAdmin("testAdmin", "testAdmin", cb);
				},
				function (cb) {
					browser.visit("http://localhost:" + helper.getPort(), function () {
						cb();
					});
				},
				function (cb) {
					browser.success.should.be.true;
					browser.window.location.pathname.should.eql("/");

					browser.clickLink("Login", function () {
						cb();
					});
				},
				function (cb) {
					browser.window.location.pathname.should.endWith("/login");
					browser.fill("username", "testAdmin").fill("password", "testAdmin").pressButton("Login", function () {
						cb();
					})
				}
			], done);
		});

		describe("Menu", function () {
			it("should have a link to Home", function () {
				should.exist(browser.document.getElementById("nav-home"));
			});

			it("should have a link to Tracking", function () {
				should.exist(browser.document.getElementById("nav-tracking"));
			});

			it("should have a link to Applications", function () {
				should.exist(browser.document.getElementById("nav-applications"));
			});

			it("should have a link to Clients", function () {
				should.exist(browser.document.getElementById("nav-clients"));
			});

			it("should have a link to Users", function () {
				should.exist(browser.document.getElementById("nav-users"));
			});

			it("should not have a link to Login", function () {
				should.exist(browser.document.getElementById("nav-logout"));
			});

			it("should not have a link to Login", function () {
				should.not.exist(browser.document.getElementById("nav-login"));
			});
		});
	});
});