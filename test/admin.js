var Browser = require("zombie");
var should = require("should");

var pkg = require("../package.json");

describe('Administrator User', function() {
    var browser = {};

    beforeEach(function(done) {
        browser = new Browser({});

        browser.visit("http://localhost:3000/", function() {
            browser.success.should.be.true;

            browser.window.location.pathname.should.eql("/");
            browser.clickLink("Login", function() {
                browser.window.location.pathname.should.endWith("/admin/");
                browser.fill("username", "testAdmin").fill("password", "admin-pass").pressButton("Login", function() {

                    done();
                })
            });
        });
    });

    it("Can Log In", function() {
        // Form submitted, new page loaded.
        browser.success.should.be.true;
        browser.window.location.pathname.should.endWith("/admin/overview");
    });

    describe("Menu Navigation", function() {
        it('should have a Home link', function() {
            should.exist(browser.link("Home"));
        });

        it('should have a Tracking link', function() {
            should.exist(browser.link("Tracking"));
        });

        it('should have a Users link', function() {
            should.exist(browser.link("Users"));
        });

        it('should have a Logout link', function() {
            should.exist(browser.link("Logout"));
        });

        it('Home should return to /admin/', function(done) {
            browser.clickLink("Home", function() {
                browser.window.location.pathname.should.eql("/admin/");

                done();
            });
        });

        it('Tracking should return to /admin/tracking/', function(done) {
            browser.clickLink("Tracking", function() {
                browser.window.location.pathname.should.eql("/admin/tracking/");

                done();
            });
        });

        it('Users should return to /admin/users/', function(done) {
            browser.clickLink("Users", function() {
                browser.window.location.pathname.should.eql("/admin/users/");

                done();
            });
        });

        it('Logout should redirect to /', function(done) {
            browser.clickLink("Logout", function() {

                browser.window.location.pathname.should.eql("/");

                done();
            });
        });
    });
});
