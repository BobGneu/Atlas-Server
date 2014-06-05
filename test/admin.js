var Browser = require("zombie");
var should = require("should");

var helper = require('./testHelper');

describe('Administrator User', function () {

	before(function (done) {
		this.server = helper.startServer(done);
	});

	after(function (done) {
		this.server.close(done);
	});

	var browser = {};

	beforeEach(function (done) {
		browser = new Browser({});

		browser.visit("http://localhost:" + helper.getPort(), function () {
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

	describe("Footer", function () {
		it('should have the copyright notification', function () {
			browser.text("#footer").should.endWith("Copyright Gneu LLC. © 2014");
		});

		it('should have a link to gneu.org', function () {
			var link = browser.link("Gneu");

			should.exist(link);
			link.href.should.eql("http://gneu.org/");
		});

		it('should have a link to the issues page on github', function () {
			var link = browser.link("Issues");

			should.exist(link);
			link.href.should.eql("https://github.com/BobGneu/Atlas-Server/issues");

			browser.text("#footer").should.match(/Issues/);
		});

		it('should have a link to the wiki page on github', function () {
			var link = browser.link("Wiki");

			should.exist(link);
			link.href.should.eql("https://github.com/BobGneu/Atlas-Server/wiki");

			browser.text("#footer").should.match(/Wiki/);
		});

		it('should have the version shown', function () {
			browser.text("#footer").should.startWith("v." + helper.getVersion());
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

			var username = helper.generate.username();

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

			var username = helper.generate.username();

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

				var table = helper.Table2Object(browser, "user-table");

				table.found.should.be.true;
				table.should.property('username');

				table.username.should.not.containEql("a");

				done();
			});
		});

		it("should be able to create a new user", function (done) {

			var username = helper.generate.username();
			var uid = helper.generate.uid();
			var email = helper.generate.email(username);

			browser.text("#user-add").should.eql("Add User");
			browser.fill("username", username).fill("email", email).fill("uid", uid).fill("password", "myPassword").pressButton("Save", function () {
				browser.statusCode.should.equal(201);

				var table = helper.Table2Object(browser, "user-table");

				table.found.should.be.true;

				table.should.property('username');
				table.username.should.containEql(username);

				table.should.property('email');
				table.email.should.containEql(email);

				table.should.property('uid');
				table.uid.should.containEql(uid);

				done();
			});
		});

		it("should be able to delete an existing user", function (done) {

			var username = helper.generate.username();
			var uid = helper.generate.uid();
			var email = helper.generate.email(username);

			browser.text("#user-add").should.eql("Add User");
			browser.fill("username", username).fill("email", email).fill("uid", uid).fill("password", "myPassword").pressButton("Save", function () {
				browser.statusCode.should.equal(201);

				var table = helper.Table2Object(browser, "user-table");

				table.found.should.be.true;

				table.should.property('username');
				table.username.should.containEql(username);

				table.should.property('email');
				table.email.should.containEql(email);

				table.should.property('uid');
				table.uid.should.containEql(uid);

				var id = browser.link(username).getAttribute("href").split("/")[3];

				browser.clickLink("A[href$='" + id + "'][alt='Delete']", function (e, b, s) {

					var table = helper.Table2Object(browser, "user-table");

					table.found.should.be.true;

					table.should.property('username');
					table.username.should.not.containEql(username);

					table.should.property('email');
					table.email.should.not.containEql(email);

					table.should.property('uid');
					table.uid.should.not.containEql(uid);

					done();
				});
			});
		});

		it("User list is present", function () {
			browser.text("#user-listing").should.startWith("Users");
		});
	});
});