var Browser = require("zombie");
var should = require("should");

var debug = require('debug')('atlas-server');
var app = require('../app');

app.set('port', process.env.PORT || 3001);

var pkg = require("../package.json");

function randomInt(low, high) {
	return Math.floor(Math.random() * (high - low) + low);
}

describe('Administrator User', function () {

	before(function (done) {
		this.server = app.listen(app.get('port'), function () {
			debug('Express server listening on port ' + app.get('port'));
			done();
		});
	});

	after(function (done) {
		this.server.close(done);
	});

	var browser = {};

	beforeEach(function (done) {
		browser = new Browser({});

		browser.visit("http://localhost:" + app.get("port"), function () {
			browser.success.should.be.true;

			browser.window.location.pathname.should.eql("/");
			browser.clickLink("Login", function () {
				browser.window.location.pathname.should.endWith("/admin/");
				browser.fill("username", "testAdmin").fill("password", "admin-pass").pressButton("Login", function () {

					done();
				})
			});
		});
	});

	it("Can Log In", function () {
		// Form submitted, new page loaded.
		browser.success.should.be.true;
		browser.window.location.pathname.should.endWith("/admin/overview");
	});

	describe("Menu Navigation", function () {
		it('should have a Home link', function () {
			should.exist(browser.link("Home"));
		});

		it('should have a Tracking link', function () {
			should.exist(browser.link("Tracking"));
		});

		it('should have a Users link', function () {
			should.exist(browser.link("Users"));
		});

		it('should have a Logout link', function () {
			should.exist(browser.link("Logout"));
		});

		it('Home should return to /admin/', function (done) {
			browser.clickLink("Home", function () {
				browser.window.location.pathname.should.eql("/admin/");

				done();
			});
		});

		it('Tracking should return to /admin/tracking/', function (done) {
			browser.clickLink("Tracking", function () {
				browser.window.location.pathname.should.eql("/admin/tracking/");

				done();
			});
		});

		it('Users should return to /admin/users/', function (done) {
			browser.clickLink("Users", function () {
				browser.window.location.pathname.should.eql("/admin/users/");

				done();
			});
		});

		it('Logout should redirect to /', function (done) {
			browser.clickLink("Logout", function () {

				browser.window.location.pathname.should.eql("/");

				done();
			});
		});
	});

	describe("Tracking", function () {

		beforeEach(function (done) {
			browser.clickLink("Tracking", function () {
				browser.window.location.pathname.should.eql("/admin/tracking/");

				done();
			});
		});

		it("Statistics Page present", function () {
			browser.text("#statistics").should.eql("Statistics");
		});
	});

	describe("Users", function () {

		beforeEach(function (done) {
			browser.clickLink("Users", function () {
				browser.window.location.pathname.should.eql("/admin/users/");

				done();
			});
		});

		it("form exists", function () {
			browser.text("#user-add").should.eql("Add User");
		});

		it("should block empty input", function (done) {

			browser.text("#user-add").should.eql("Add User");
			browser.pressButton("Save", function () {

				should.exist(browser.document.getElementById("messages"));

				browser.text("#messages").should.match(/username is required/);
				browser.text("#messages").should.match(/password is required/);

				done();
			});
		});

		it("username is required", function (done) {

			browser.text("#user-add").should.eql("Add User");
			browser.pressButton("Save", function () {

				should.exist(browser.document.getElementById("messages"));

				browser.text("#messages").should.match(/username is required/);

				done();
			});
		});

		it("uid is required", function (done) {

			browser.text("#user-add").should.eql("Add User");
			browser.pressButton("Save", function () {

				should.exist(browser.document.getElementById("messages"));

				browser.text("#messages").should.match(/uid is required/);

				done();
			});
		});

		it("email address is required", function (done) {

			var username = "user#" + randomInt(10000000, 100000000);
			browser.text("#user-add").should.eql("Add User");
			browser.pressButton("Save", function () {

				browser.text("#messages").should.match(/email is required/);

				done();
			});
		});

		it("should block empty passwords", function (done) {
			browser.text("#user-add").should.eql("Add User");
			browser.pressButton("Save", function () {

				browser.text("#messages").should.match(/password is required/);

				done();
			});
		});

		it("should block short passwords", function (done) {

			var username = "user#" + randomInt(10000000, 100000000);

			browser.text("#user-add").should.eql("Add User");
			browser.fill("username", username).fill("password", "a").pressButton("Save", function () {

				browser.text("#messages").should.match(/password must be at least 6 characters in length/);

				done();
			});
		});

		it("should block short usernames", function (done) {

			browser.text("#user-add").should.eql("Add User");
			browser.fill("username", "a").pressButton("Save", function () {

				browser.text("#messages").should.match(/username must be at least 6 characters in length/);

				done();
			});
		});

		it("should be able to create a new user", function (done) {

			var username = "user." + randomInt(10000000, 100000000);
			var uid = "" + randomInt(10000000, 100000000);
			var email = username + "@gneu.org";

			browser.text("#user-add").should.eql("Add User");
			browser.fill("username", username).fill("email", email).fill("uid", uid).fill("password", "myPassword").pressButton("Save", function () {

				var foundUsername = false;
				var foundEmail = false;
				var foundUID = false;

				var table = browser.document.getElementById("user-table");

				for (var i = table.childNodes.length - 1; i >= 0; i--) { // 
					for (var j = table.childNodes[i].childNodes.length - 1; j >= 1; j--) { // tr
						for (var k = table.childNodes[i].childNodes[j].childNodes.length - 1; k >= 0; k--) { // td
							var tmp = table.childNodes[i].childNodes[j].childNodes[k].textContent;

							if (tmp === username) {
								foundUsername = true;
							}

							if (tmp === email) {
								foundEmail = true;
							}

							if (tmp === uid) {
								foundUID = true;
							}
						};
					};
				};

				(foundUID && foundEmail && foundUsername).should.be.true;

				done();
			});
		});

		it("User list is present", function () {
			browser.text("#user-listing").should.startWith("Users");
		});
	});
});