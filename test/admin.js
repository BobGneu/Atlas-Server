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
});
