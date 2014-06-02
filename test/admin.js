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

    describe("Tracking", function() {

        beforeEach(function(done) {
            browser.clickLink("Tracking", function() {
                browser.window.location.pathname.should.eql("/admin/tracking/");

                done();
            });
        });

        it("Statistics Page present", function() {
            browser.text("#statistics").should.eql("Statistics");
        });
    });

    describe("Users", function() {

        beforeEach(function(done) {
            browser.clickLink("Users", function() {
                browser.window.location.pathname.should.eql("/admin/users/");

                done();
            });
        });

        describe("Adding a user", function() {
            it("form exists", function() {
                browser.text("#user-add").should.eql("Add User");
            });

            it("should block empty input", function(done) {
                browser.text("#user-add").should.eql("Add User");
                browser.fill("username", "").fill("password", "").pressButton("Save", function() {

                    browser.text("#content").should.match(/username is required/);
                    browser.text("#content").should.match(/password is required/);

                    done();
                });
            });

            it("should block empty usernames", function(done) {
                browser.text("#user-add").should.eql("Add User");
                browser.fill("username", "").fill("password", "password").pressButton("Save", function() {

                    browser.text("#content").should.match(/username is required/);

                    done();
                });
            });
            it("should block short usernames", function(done) {
                browser.text("#user-add").should.eql("Add User");
                browser.fill("username", "2222").fill("password", "password").pressButton("Save", function() {

                    browser.text("#content").should.match(/username has invalid characters/);

                    done();
                });
            });

            it("should block empty passwords", function(done) {
                browser.text("#user-add").should.eql("Add User");
                browser.fill("username", "username").fill("password", "").pressButton("Save", function() {

                    browser.text("#content").should.match(/password is required/);

                    done();
                });
            });

            it("should block short passwords", function(done) {
                browser.text("#user-add").should.eql("Add User");
                browser.fill("username", "username").fill("password", "22222").pressButton("Save", function() {

                    browser.text("#content").should.match(/password has invalid characters/);

                    done();
                });
            });

            it("should Capture duplicate users", function(done) {
                browser.text("#user-add").should.eql("Add User");
                browser.fill("username", "testUser").fill("password", "user-pass").pressButton("Save", function() {

                    // Confirm that the page shows that user. 

                    done();
                });
            });
        });

        it("User list is present", function() {
            browser.text("#user-listing").should.eql("Users");
        });
    });
});
