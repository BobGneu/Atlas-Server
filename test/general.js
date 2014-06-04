var Browser = require("zombie");
var should = require("should");

var helper = require('./testHelper');

describe('General User', function () {

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

			done();
		});
	});

	describe("Menu Navigation", function () {
		it('should have a Home link', function () {
			should.exist(browser.link("Home"));
		});

		it('should have a Login link', function () {
			should.exist(browser.link("Login"));
		});

		it('Home should return to /', function (done) {
			browser.clickLink("Home", function () {
				browser.window.location.pathname.should.eql("/");

				done();
			});
		});

		it('Login should redirect to /admin/', function (done) {
			browser.clickLink("Login", function () {

				browser.window.location.pathname.should.eql("/admin/");

				done();
			});
		});
	});

	it("Can't log in", function (done) {
		browser.clickLink("Login", function () {
			browser.window.location.pathname.should.endWith("/admin/");
			browser.fill("username", "testUser").fill("password", "user-pass").pressButton("Login", function () {

				// Form submitted, new page loaded.
				browser.success.should.be.true;
				browser.window.location.pathname.should.endWith("/admin/");

				done();
			})
		});
	});
});