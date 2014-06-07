var Browser = require("zombie");
var should = require("should");
var async = require("async");
var users = require("../src/db");

var helper = require('./testHelper');

describe('Users & Authentication', function () {

	var browser = {};

	before(function (done) {
		this.server = helper.startServer(function () {
			helper.InitializeDatabase(function (err, result) {
				done();
			});
		});
	});

	after(function (done) {
		this.server.close(done);
	});

	describe("Unauthenticated User", function () {

		beforeEach(function (done) {
			browser = new Browser({});
			done();
		});
		it("should be able to see /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/login", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		it("should not be able to see /tracking and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/tracking", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		describe("Tracking Management", function () {
			it("should not be able to create a new report");
			it("should not be able to view a report");
			it("should not be able to update a report's query");
			it("should not be able to delete a report");
		});

		it("should not be able to see /clients and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/clients", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		describe("Client Management", function () {
			it("should not be able to create a new client");

			it("should not be able to view an client's overview");

			it("should not be able to update an client's information");
			it("should not be able to update an client's security values");

			it("should not be able to purge a clients data from the system");

			it("should not be able to delete an client");
		});

		it("should not be able to see /applications and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/applications", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		describe("Application Management", function () {
			it("should not be able to create a new application");

			it("should not be able to view an application's overview");

			it("should not be able to update an application's information");
			it("should not be able to update an application's default security values");

			it("should not be able to delete an application");
		});

		it("should not be able to see /users and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/users", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		describe("User Management", function () {
			it("should not be able to create a new manager");
			it("should not be able to create a new administrator");

			it("should not be able to view a user's overview");

			it("should not be able to update a user's information");
			it("should not be able to update a user's role manager -> admin");

			it("should not be able to delete a user");
		});

		it("should not be able to see /overview and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/overview", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});
	});

	describe("Manager", function () {

		before(function (done) {
			helper.createManager("testManager", "testManager", done);
		});

		describe("Logging in", function () {
			it("should land on overview page");
		});

		describe("Logged in", function () {

			beforeEach(function (done) {
				browser = new Browser({});

				browser.visit("http://localhost:" + helper.getPort(), function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/");
					browser.clickLink("Login", function () {
						browser.window.location.pathname.should.endWith("/login");
						browser.fill("username", "testManager").fill("password", "testManager").pressButton("Login", function () {
							done();
						})
					});
				});
			});

			it("should be able to see /overview");
			it("should be able to see /tracking");

			describe("Tracking Management", function () {
				it("should be able to create a new report");
				it("should be able to view a report");
				it("should be able to update a report's query");
				it("should be able to delete a report");
			});

			it("should be able to see /clients");

			describe("Client Management", function () {
				it("should be able to create a new client");

				it("should be able to view an client's overview");

				it("should be able to update an client's information");
				it("should be able to update an client's security values");

				it("should be able to purge a clients data from the system");

				it("should be able to delete an client");
			});

			it("should be able to see /applications");

			describe("Application Management", function () {
				it("should be able to create a new application");

				it("should be able to view an application's overview");

				it("should be able to update an application's information");
				it("should be able to update an application's default security values");

				it("should be able to delete an application");
			});

			it("should not be able to see /users and be redirected back to /overview");

			describe("User Management", function () {
				it("should not be able to create a new manager");
				it("should not be able to create a new administrator");

				it("should not be able to view a user's overview");

				it("should not be able to update a user's information");
				it("should not be able to update a user's role manager -> admin");

				it("should not be able to delete a user");
			});
		});
	});

	describe("Administrator", function () {

		before(function (done) {
			helper.createAdmin("testAdmin", "testAdmin", done);
		});

		describe("Logging in", function () {
			it("should land on overview page");
		});

		describe("Logged in", function () {

			beforeEach(function (done) {
				browser = new Browser({});

				browser.visit("http://localhost:" + helper.getPort(), function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/");
					browser.clickLink("Login", function () {
						browser.window.location.pathname.should.endWith("/login");
						browser.fill("username", "testAdmin").fill("password", "testAdmin").pressButton("Login", function () {
							done();
						})
					});
				});
			});

			it("should be able to see /overview");

			it("should be able to see /tracking");

			describe("Tracking Management", function () {
				it("should be able to create a new report");
				it("should be able to view a report");
				it("should be able to update a report's query");
				it("should be able to delete a report");
			});

			it("should be able to see /clients");

			describe("Client Management", function () {
				it("should be able to create a new client");

				it("should be able to view an client's overview");

				it("should be able to update an client's information");
				it("should be able to update an client's security values");

				it("should be able to purge a clients data from the system");

				it("should be able to delete an client");
			});

			it("should be able to see /applications");

			describe("Application Management", function () {
				it("should be able to create a new application");

				it("should be able to view an application's overview");

				it("should be able to update an application's information");
				it("should be able to update an application's default security values");

				it("should be able to delete an application");
			});

			it("should be able to see /users/");

			describe("User Management", function () {
				it("should be able to create a new manager");
				it("should be able to create a new administrator");

				it("should be able to view a user's overview");

				it("should be able to update a user's information");
				it("should be able to update a user's role manager -> admin");

				it("should be able to delete a user");
			});
		});
	});
});