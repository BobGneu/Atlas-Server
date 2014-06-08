var Browser = require("zombie");

var should = require("should");
var models = require('../src/atlas.models.js');
var request = require("request");

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
			it("should not be able to create a new report", function (done) {
				request({
					method: 'POST',
					uri: "http://localhost:" + helper.getPort() + "/tracking/create",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to view a report", function (done) {
				request({
					method: 'GET',
					uri: "http://localhost:" + helper.getPort() + "/tracking/42",
				}, function (error, response, body) {

					response.statusCode.should.eql(200);
					response.request.uri.path.should.eql("/login");

					done();
				});
			});

			it("should not be able to update a report's query", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/tracking/update/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to delete a report", function (done) {
				request({
					method: 'DELETE',
					uri: "http://localhost:" + helper.getPort() + "/tracking/delete/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});
		});

		it("should not be able to see /clients and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/clients", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		describe("Client Management", function () {
			it("should not be able to create a new client", function (done) {
				request({
					method: 'POST',
					uri: "http://localhost:" + helper.getPort() + "/clients/create",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to view an client's overview", function (done) {
				request({
					method: 'GET',
					uri: "http://localhost:" + helper.getPort() + "/clients/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(200);
					response.request.uri.path.should.eql("/login");

					done();
				});
			});

			it("should not be able to update an client's information", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/clients/update/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to update an client's security values", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/clients/updateSecurity/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to purge a clients data from the system", function (done) {
				request({
					method: 'DELETE',
					uri: "http://localhost:" + helper.getPort() + "/clients/purge/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to delete an client", function (done) {
				request({
					method: 'DELETE',
					uri: "http://localhost:" + helper.getPort() + "/clients/delete/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});
		});

		it("should not be able to see /applications and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/applications", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		describe("Application Management", function () {
			it("should not be able to create a new application", function (done) {
				request({
					method: 'POST',
					uri: "http://localhost:" + helper.getPort() + "/applications/create",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to view an application's overview", function (done) {
				request({
					method: 'GET',
					uri: "http://localhost:" + helper.getPort() + "/applications/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(200);
					response.request.uri.path.should.eql("/login");

					done();
				});
			});

			it("should not be able to update an application's information", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/applications/update/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to update an application's default security values", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/applications/updateSecurity/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to delete an application", function (done) {
				request({
					method: 'DELETE',
					uri: "http://localhost:" + helper.getPort() + "/applications/delete/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});
		});

		it("should not be able to see /users and be redirected back to /login", function (done) {
			browser.visit("http://localhost:" + helper.getPort() + "/users", function () {
				browser.success.should.be.true;

				browser.window.location.pathname.should.eql("/login");

				done();
			});
		});

		describe("User Management", function () {
			it("should not be able to create a new manager", function (done) {
				request({
					method: 'POST',
					uri: "http://localhost:" + helper.getPort() + "/users/create",
					params: {
						role: "manager"
					}
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to create a new administrator", function (done) {
				request({
					method: 'POST',
					uri: "http://localhost:" + helper.getPort() + "/users/create",
					params: {
						role: "administrator"
					}
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to view a user's overview", function (done) {
				request({
					method: 'GET',
					uri: "http://localhost:" + helper.getPort() + "/users/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(200);
					response.request.uri.path.should.eql("/login");

					done();
				});
			});

			it("should not be able to update a user's information", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/users/update/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to update a user's role manager -> admin", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/users/update/42",
					params: {
						role: "Administrator"
					}
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to update a user's role admin -> manager", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/users/update/42",
					params: {
						role: "Manager"
					}
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to delete a user", function (done) {
				request({
					method: 'DELETE',
					uri: "http://localhost:" + helper.getPort() + "/users/delete/42",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});
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
			it("should land on overview page", function (done) {
				browser = new Browser({});

				browser.visit("http://localhost:" + helper.getPort() + "/login", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");
					browser.fill("username", "testManager").fill("password", "testManager").pressButton("Login", function () {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/overview");
						done();
					});
				});
			});
		});

		describe("Logged in", function () {

			beforeEach(function (done) {
				browser = new Browser({});

				browser.visit("http://localhost:" + helper.getPort() + "/login", function () {
					browser.success.should.be.true;
					browser.window.location.pathname.should.endWith("/login");
					browser.fill("username", "testManager").fill("password", "testManager").pressButton("Login", function () {
						done();
					});
				});
			});

			it("should be able to see /overview", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/overview", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/overview");
					done();
				});
			});

			it("should be able to see /tracking", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/tracking", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/tracking");
					done();
				});
			});

			describe("Tracking Management", function () {
				it("should be able to create a new report", function (done) {

					var testTitle = "report_title"
					browser.clickLink("Tracking", function () {
						browser.fill("name", testTitle).pressButton("Create", function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/tracking/");
							browser.window.location.pathname.should.match(/\w+$/);

							var title = browser.document.getElementById("report-title");

							should.exist(title);
							title.innerHTML.should.eql(testTitle);

							done();
						})
					});
				});
				it("should be able to view a report");
				it("should be able to update a report's query");
				it("should be able to delete a report");
			});

			it("should be able to see /clients", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/clients", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/clients");
					done();
				});
			});

			describe("Client Management", function () {
				it("should be able to create a new client", function (done) {

					var testUID = "00000000001";

					browser.clickLink("Clients", function () {
						browser.fill("uid", testUID).check("Allow Game").check("Allow Editor").pressButton("Create", function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/clients/");
							browser.window.location.pathname.should.match(/\w+$/);

							var uid = browser.document.getElementById("client-uid");

							should.exist(uid);
							uid.innerHTML.should.eql(testUID);

							done();
						});
					});
				});

				it("should be able to view an client's overview");

				it("should be able to update an client's information");
				it("should be able to update an client's security values");

				it("should be able to purge a clients data from the system");

				it("should be able to delete an client");
			});

			it("should be able to see /applications", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/applications", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/applications");
					done();
				});
			});

			describe("Application Management", function () {
				it("should be able to create a new application", function (done) {

					var testName = "Exodus";

					browser.clickLink("Applications", function () {
						browser.fill("name", testName).check("Allow Game").check("Allow Editor").pressButton("Create", function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/applications/");
							browser.window.location.pathname.should.match(/\w+$/);

							var name = browser.document.getElementById("application-name");

							should.exist(name);
							name.innerHTML.should.eql(testName);

							done();
						});
					});
				});

				it("should be able to view an application's overview");

				it("should be able to update an application's information");
				it("should be able to update an application's default security values");

				it("should be able to delete an application");
			});

			it("should be able to see /users and be redirected back to /overview", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/users", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/users");
					done();
				});
			});

			describe("User Management", function () {
				it("should be able to create a new manager", function (done) {

					var testName = "User42";
					var password = "User42";

					browser.clickLink("Users", function () {
						browser.fill("name", testName).select("role", "Manager").fill("email", testName + "@gneu.org").fill("password", password).fill("password-conf", password).pressButton("Create", function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/users/");
							browser.window.location.pathname.should.match(/\w+$/);

							var name = browser.document.getElementById("user-name");

							should.exist(name);
							name.innerHTML.should.eql(testName.toLowerCase());

							done();
						});
					});
				});

				it("should not be able to create a new administrator");

				it("should not be able to view a user's overview");

				it("should not be able to update a user's information");

				it("should be able to delete a manager");

				it("should not be able to delete an administrator");
			});
		});
	});

	describe("Administrator", function () {

		before(function (done) {
			helper.createAdmin("testAdmin", "testAdmin", done);
		});

		describe("Logging in", function () {
			it("should land on overview page", function (done) {
				browser = new Browser({});

				browser.visit("http://localhost:" + helper.getPort() + "/login", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");
					browser.fill("username", "testManager").fill("password", "testManager").pressButton("Login", function () {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/overview");
						done();
					});
				});
			});
		});

		describe("Logged in", function () {

			beforeEach(function (done) {
				browser = new Browser({});

				browser.visit("http://localhost:" + helper.getPort() + "/login", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");
					browser.fill("username", "testAdmin").fill("password", "testAdmin").pressButton("Login", function () {
						done();
					});
				});
			});

			it("should be able to see /overview", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/overview", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/overview");
					done();
				});
			});

			it("should be able to see /tracking", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/tracking", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/tracking");
					done();
				});
			});

			describe("Tracking Management", function () {
				it("should be able to create a new report", function (done) {
					browser.clickLink("Tracking", function () {
						browser.fill("name", "testAdmin").pressButton("Create", function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/tracking/");
							browser.window.location.pathname.should.match(/\w+$/);

							done();
						})
					});
				});

				it("should be able to view a report");
				it("should be able to update a report's query");
				it("should be able to delete a report");
			});

			it("should be able to see /clients", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/clients", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/clients");
					done();
				});
			});

			describe("Client Management", function () {
				it("should be able to create a new client");

				it("should be able to view an client's overview");

				it("should be able to update an client's information");
				it("should be able to update an client's security values");

				it("should be able to purge a clients data from the system");

				it("should be able to delete an client");
			});

			it("should be able to see /applications", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/applications", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/applications");
					done();
				});
			});

			describe("Application Management", function () {
				it("should be able to create a new application");

				it("should be able to view an application's overview");

				it("should be able to update an application's information");
				it("should be able to update an application's default security values");

				it("should be able to delete an application");
			});

			it("should be able to see /users", function (done) {
				browser.visit("http://localhost:" + helper.getPort() + "/users", function () {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/users");
					done();
				});
			});

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