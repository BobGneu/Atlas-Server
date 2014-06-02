var Browser = require("zombie");
var should = require("should");

var pkg = require("../package.json");

describe('Non-Logged In User', function() {
    var browser = {};

    beforeEach(function(done) {
        browser = new Browser({});

        browser.visit("http://localhost:3000/", function() {
            browser.success.should.be.true;

            browser.window.location.pathname.should.eql("/");

            done();
        });
    });
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

        it('should have a link to gneu.org', function() {
            var link = browser.link("Gneu");

            should.exist(link);
            link.href.should.eql("http://gneu.org/");
        });

        it('should have a link to the issues page on github', function() {
            var link = browser.link("Issues");

            should.exist(link);
            link.href.should.eql("https://github.com/BobGneu/Atlas-Server/issues");

            browser.text("#footer").should.match(/Issues/);
        });

        it('should have a link to the wiki page on github', function() {
            var link = browser.link("Wiki");

            should.exist(link);
            link.href.should.eql("https://github.com/BobGneu/Atlas-Server/wiki");

            browser.text("#footer").should.match(/Wiki/);
        });

        it('should have the version shown', function() {
            browser.text("#footer").should.startWith("v." + pkg.version);
        });
    });

    describe("Body", function() { // Unlogged in user 
        it('should have the intro blurb shown', function() {
            browser.text("#content").should.eql("Alpha Lock, Analytics & Tracking Atlas provides two way communication between your application and your server, providing custom event tracking and analytics.");
        });
    });

    it("Can't log in", function(done) {
        browser.clickLink("Login", function() {
            browser.window.location.pathname.should.endWith("/admin/");
            browser.fill("username", "").fill("password", "").pressButton("Login", function() {

                // Form submitted, new page loaded.
                browser.success.should.be.true;
                browser.window.location.pathname.should.endWith("/admin/");

                done();
            })
        });
    });
});
