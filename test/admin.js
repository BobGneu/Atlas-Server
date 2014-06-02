var Browser = require("zombie");
var should = require("should");

var pkg = require("../package.json");

describe('Atlas', function() {
    var browser = {};

    beforeEach(function(done) {
        browser = new Browser({});

        browser.visit("http://localhost:3000/", function() {
            browser.success.should.be.true;

            browser.window.location.pathname.should.eql("/");

            done();
        });
    });

    describe('General User', function() {

        it('Application should be running', function() {
            browser.success.should.be.true;
        });

        it('Title should be set to Atlas Control Panel', function() {
            browser.window.title.should.startWith("Atlas Control Panel");
        });

        it('Title should include the version', function() {
            browser.window.title.should.endWith(" v." + pkg.version);
        });

        it('The page should have the header', function() {
            should.exist(browser.document.getElementById("header"));
        });

        it('The page should have the footer', function() {
            should.exist(browser.document.getElementById("footer"));
        });

        it('The page should have the menu', function() {
            should.exist(browser.document.getElementById("menu"));
        });

        describe("Header", function() {
            it('should have the application name', function() {
                browser.text("#header").should.eql("Atlas Control Panel");
            });
        });

        describe("Footer", function() {
            it('should have the copyright notification', function() {
                browser.text("#footer").should.endWith("Copyright Gneu LLC. © 2014");
            });

            it('should have the version shown', function() {
                browser.text("#footer").should.startWith("v." + pkg.version);
            });
        });

        describe("Menu", function() {
            it('should have the version shown', function() {
                browser.text("#menu").should.startWith("Home Login");
            });
            describe("Navigation", function() {
                it('Home should return to /', function(done) {
                    browser.clickLink("Home", function() {
                        browser.window.location.pathname.should.eql("/");

                        done();
                    });
                });
                it('Login should redirect to /admin/', function(done) {
                    browser.clickLink("Login", function() {

                        browser.window.location.pathname.should.eql("/admin/");

                        done();
                    });
                });
            });
        });

        describe("Body", function() {
            it('should have the version shown', function() {
                browser.text("#content").should.eql("Alpha Lock, Analytics & Tracking Atlas provides two way communication between your application and your server, providing custom event tracking and analytics.");
            });
        });

    	it("Cant Log In as non-admin", function(done) {
            browser.clickLink("Login", function() {
                browser.window.location.pathname.should.endWith("/admin/");
                browser.fill("username", "testUser").fill("password", "user-pass").pressButton("Login", function() {

                    // Form submitted, new page loaded.
                    browser.success.should.be.true;
                    browser.window.location.pathname.should.endWith("/admin/");

                    done();
                })
            });
        });
    });

    describe('Administrator User', function() {
        it("Can Log In as Admin", function(done) {
            browser.clickLink("Login", function() {
                browser.window.location.pathname.should.endWith("/admin/");
                browser.fill("username", "testAdmin").fill("password", "admin-pass").pressButton("Login", function() {

                    // Form submitted, new page loaded.
                    browser.success.should.be.true;
                    browser.window.location.pathname.should.endWith("/admin/overview");

                    done();
                })
            });
        });
    });
});
