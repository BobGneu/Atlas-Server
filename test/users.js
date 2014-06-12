var Browser = require("zombie"),
	should = require("should"),
	request = require("request"),
	async = require("async");

var helper = require('./testHelper');

var models = require('../src/atlas.models.js'),
	user = models.User,
	client = models.Client,
	tracking = models.Report,
	application = models.Application;

describe('Users & Authentication', function () {

	var browser = {};

	before(function (done) {
		var that = this;

		async.series([

			function (cb) {
				that.server = helper.startServer(cb);
			},
			function (cb) {
				helper.InitializeDatabase(cb);
			}
		], done);
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
			async.series([

				function (cb) {
					browser.visit("http://localhost:" + helper.getPort() + "/login", cb);
				},
				function (cb) {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");

					cb();
				},
			], done);
		});

		it("should not be able to see /tracking and be redirected back to /login", function (done) {
			async.series([

				function (cb) {
					browser.visit("http://localhost:" + helper.getPort() + "/tracking", cb);
				},
				function (cb) {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");

					cb();
				}
			], done);
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
			async.series([

				function (cb) {
					browser.visit("http://localhost:" + helper.getPort() + "/clients", cb);
				},
				function (cb) {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");
					cb();
				}
			], done);
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
			async.series([

				function (cb) {
					browser.visit("http://localhost:" + helper.getPort() + "/applications", cb);
				},
				function (cb) {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");
					cb();
				}
			], done);
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
			async.series([

				function (cb) {
					browser.visit("http://localhost:" + helper.getPort() + "/users", cb);
				},
				function (cb) {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");

					cb();
				}
			], done);
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
					uri: "http://localhost:" + helper.getPort() + "/users/email",
					params: {
						role: "tony@yahoo.com"
					}
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});

			it("should not be able to update a user's role manager -> admin", function (done) {
				request({
					method: 'PUT',
					uri: "http://localhost:" + helper.getPort() + "/users/role",
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
					uri: "http://localhost:" + helper.getPort() + "/users/role",
					params: {
						pk: 42,
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
					uri: "http://localhost:" + helper.getPort() + "/users",
				}, function (error, response, body) {
					response.statusCode.should.eql(302);
					response.headers.location.should.eql("/login");

					done();
				});
			});
		});

		it("should not be able to see /overview and be redirected back to /login", function (done) {
			async.series([

				function (cb) {
					browser.visit("http://localhost:" + helper.getPort() + "/overview", cb);
				},
				function (cb) {
					browser.success.should.be.true;

					browser.window.location.pathname.should.eql("/login");
					cb();
				}
			], done);
		});
	});

	describe("Manager", function () {

		before(function (done) {
			helper.createManager("testManager", "testManager", done);
		});

		describe("Logging in", function () {
			it("should land on overview page", function (done) {
				async.series([

					function (cb) {
						browser = new Browser({});

						browser.visit("http://localhost:" + helper.getPort() + "/login", cb);
					},
					function (cb) {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/login");
						browser.fill("username", "testManager").fill("password", "testManager").pressButton("Login", cb);
					},
					function (cb) {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/overview");
						cb();
					}
				], done);
			});
		});

		describe("Logged in", function () {

			beforeEach(function (done) {
				async.series([

					function (cb) {
						browser = new Browser({});
						browser.visit("http://localhost:" + helper.getPort() + "/login", cb);
					},
					function (cb) {
						browser.success.should.be.true;
						browser.window.location.pathname.should.endWith("/login");
						browser.fill("username", "testManager").fill("password", "testManager").pressButton("Login", cb);
					}
				], done);
			});

			it("should be able to see /overview", function (done) {
				async.series([

					function (cb) {
						browser.visit("http://localhost:" + helper.getPort() + "/overview", cb);
					},
					function (cb) {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/overview");

						cb();
					}
				], done);
			});

			it("should be able to see /tracking", function (done) {
				async.series([

					function (cb) {
						browser.visit("http://localhost:" + helper.getPort() + "/tracking", cb);
					},
					function (cb) {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/tracking");

						cb();
					}
				], done);
			});

			describe("Tracking Management", function () {
				it("should include a listing of the reports", function (done) {
					// clear out all tracking
					tracking.find({}, function (err, reports) {
						reports.length.should.eql(0);

						browser.clickLink("Tracking", function () {
							browser.success.should.be.true;
							should.not.exist(browser.document.getElementById("tracking-listing"));

							// create n applications and test to confirm that the table shows up. 

							done();
						});
					});
				});

				it("should include actions for each entry in the listing of reports", function (done) {

					helper.createSampleReports(20, function () {
						// create n applications and test to confirm that the table shows up. 
						browser.clickLink("Tracking", function () {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("reports-listing"));

							var table = helper.Table2Object(browser, "reports-listing");

							table.name.length.should.eql(table.actions.length);
							done();
						});
					});
				});

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

				it("should be able to view a report", function (done) {
					async.series([

						function (cb) {
							models.Report.remove({}, cb);
						},
						function (cb) {
							helper.createSampleReports(1, cb);
						},
						function (cb) {
							models.Report.findOne({}, function (err, report) {
								browser.visit("http://localhost:" + helper.getPort() + "/tracking/" + report._id, function () {
									browser.success.should.be.true;

									browser.window.location.pathname.should.startWith("/tracking/");
									browser.window.location.pathname.should.endWith(report._id.toString());

									var name = browser.document.getElementById("report-title");

									should.exist(name);
									name.innerHTML.should.eql(report.Name);
									cb();
								});
							});
						},
					], done);

				});

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
				it("should include a listing of the clients", function (done) {
					async.series([

						function (cb) {
							client.remove({}, cb);
						},
						function (cb) {
							browser.clickLink("Clients", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.not.exist(browser.document.getElementById("clients-listing"));
							cb();
						},
						function (cb) {
							helper.createSampleClients(20, cb);
						},
						function (cb) {
							browser.clickLink("Clients", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("clients-listing"));
							cb();
						}
					], done);
				});

				it("should include actions for each entry in the listing of clients", function (done) {
					async.series([

						function (cb) {
							client.remove({}, cb);
						},
						function (cb) {
							helper.createSampleClients(20, cb);
						},
						function (cb) {
							browser.clickLink("Clients", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("clients-listing"));

							var table = helper.Table2Object(browser, "clients-listing");

							table.uid.length.should.eql(table.actions.length);

							cb();
						}
					], done);
				});

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

				it("should be able to view an client's overview", function (done) {
					async.series([

						function (cb) {
							client.remove({}, cb);
						},
						function (cb) {
							helper.createSampleClients(1, cb);
						},
						function (cb) {
							client.findOne({}, function (err, client) {
								browser.visit("http://localhost:" + helper.getPort() + "/clients/" + client._id, function () {
									browser.success.should.be.true;

									browser.window.location.pathname.should.startWith("/clients/");
									browser.window.location.pathname.should.endWith(client._id.toString());

									var name = browser.document.getElementById("client-uid");

									should.exist(name);
									name.innerHTML.should.eql(client.UID);
									cb();
								});
							});
						},
					], done);

				});

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
				it("should include a listing of the applications", function (done) {
					async.series([

						function (cb) {
							application.remove({}, cb);
						},
						function (cb) {
							browser.clickLink("Applications", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.not.exist(browser.document.getElementById("applications-listing"));
							cb();
						},
						function (cb) {
							helper.createSampleApplications(20, cb);
						},
						function (cb) {
							browser.clickLink("Applications", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("applications-listing"));
							cb();
						}
					], done);
				});

				it("should include actions for each entry in the listing of applications", function (done) {
					async.series([

						function (cb) {
							application.remove({}, cb);
						},
						function (cb) {
							helper.createSampleApplications(20, cb);
						},
						function (cb) {
							browser.clickLink("Applications", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("applications-listing"));

							var table = helper.Table2Object(browser, "applications-listing");

							table.name.length.should.eql(table.actions.length);

							cb();
						}
					], done);
				});

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

				it("should be able to view an application's overview", function (done) {
					async.series([

						function (cb) {
							application.remove({}, cb);
						},
						function (cb) {
							helper.createSampleApplications(1, cb);
						},
						function (cb) {
							application.findOne({}, function (err, app) {
								browser.visit("http://localhost:" + helper.getPort() + "/applications/" + app._id, function () {
									browser.success.should.be.true;

									browser.window.location.pathname.should.startWith("/applications/");
									browser.window.location.pathname.should.endWith(app._id.toString());

									var name = browser.document.getElementById("application-name");

									should.exist(name);
									name.innerHTML.should.eql(app.Name);
									cb();
								});
							});
						},
					], done);

				});

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
				it("should include a listing of the users", function (done) {
					async.series([

						function (cb) {
							browser.clickLink("Users", cb);
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("users-listing"));

							var table = helper.Table2Object(browser, "users-listing");
							user.find({}, function (err, users) {

								for (var i = 0; i < users.length; i++) {
									table.name.should.containEql(users[i].Name);
									table.email.should.containEql(users[i].Email);
									table.role.should.containEql(users[i].Role);
								};

								cb();
							});
						}
					], done);
				});

				it("should include actions for each entry in the listing of users", function (done) {
					browser.clickLink("Users", function () {
						browser.success.should.be.true;
						should.exist(browser.document.getElementById("users-listing"));

						var table = helper.Table2Object(browser, "users-listing");

						table.name.length.should.eql(table.actions.length);
						done();
					});
				});

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

							var path = browser.window.location.pathname.split("/");

							user.findOne({
								_id: models.ObjectId(path[2])
							}, function (err, res) {

								should.not.exist(err);
								should.exist(res);

								res.Name.should.eql(testName.toLowerCase());

								done();
							});
						});
					});
				});

				it("should not be able to create a new administrator", function (done) {

					var testName = "Admin42";
					var password = "Admin42";

					browser.clickLink("Users", function () {
						var roles = browser.document.getElementById("role-selector");
						var optionNodes = [];

						should.exist(roles);

						for (var i = 0; i < roles.childNodes.length; i++) {
							if (roles.childNodes[i].nodeName === "OPTION") {
								optionNodes.push(roles.childNodes[i]);
							}
						}

						optionNodes.length.should.eql(1);

						optionNodes[0].innerHTML.should.eql("Manager");
						done();
					});
				});

				it("should not be able to view a user's overview", function (done) {
					user.findOne({}, function (err, user) {
						browser.visit("http://localhost:" + helper.getPort() + "/users/" + user._id, function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/users/");
							browser.window.location.pathname.should.match(/\w+$/);

							var name = browser.document.getElementById("user-name");

							should.exist(name);
							name.innerHTML.should.eql(user.Name);
							done();
						});
					});
				});

				it("should not be able to update a user's information");

				it("should be able to delete a manager", function (done) {
					this.timeout = 3000;

					var testName = "DeleteUser22",
						password = "password",
						id = -1;

					async.series([

						function (cb) {
							browser.clickLink("Users", cb);
						},

						function (cb) {
							browser.fill("name", testName).select("role", "Manager").fill("email", testName + "@gneu.org").fill("password", password).fill("password-conf", password).pressButton("Create", cb);
						},
						function (cb) {
							browser.success.should.be.true;

							var name = browser.document.getElementById("user-name");

							should.exist(name);
							name.innerHTML.should.eql(testName.toLowerCase());

							var path = browser.window.location.pathname.split("/");
							id = path[2];
							cb();
						},
						function (cb) {
							browser.clickLink("Users", cb);
						},
						function (cb) {
							browser.clickLink("[data-pk='" + id + "'][id^='user_delete']", cb);
						},
						function (cb) {
							browser.onconfirm("Are you sure?", true);
							cb();
						},
						function (cb) {
							browser.clickLink("Users", cb);
						},
						function (cb) {
							should.exist(browser.document.getElementById("users-listing"));

							var table = helper.Table2Object(browser, "users-listing");

							table.name.should.not.containEql(testName);

							cb();
						},
					], done);
				});

				it("should not be able to delete an administrator", function (done) {
					this.timeout = 3000;

					var testName = "DeleteAdminUser2",
						id = -1;

					async.series([

						function (cb) {
							var tmp = new user({
								Name: testName,
								Email: testName + "@gneu.org",
								PasswordHash: "password",
								Role: "Administrator"
							});

							tmp.save(function (err, user) {
								id = user._id.toString();
								cb();
							});
						},
						function (cb) {
							browser.clickLink("Users", cb);
						},
						function (cb) {
							should.exist(browser.document.getElementById("users-listing"));

							var table = helper.Table2Object(browser, "users-listing");

							table.name.should.containEql(testName.toLowerCase());

							cb();
						},
						function (cb) {
							var link = browser.document.querySelector("[data-pk='" + id + "'][id^='user_delete']");

							(link === null).should.be.true;

							cb();
						}
					], done);
				});
			});
		});
	});

	describe("Administrator", function () {

		before(function (done) {
			helper.createAdmin("testAdmin", "testAdmin", done);
		});

		describe("Logging in", function () {
			it("should land on overview page", function (done) {
				async.series([

					function (cb) {
						browser = new Browser({});

						browser.visit("http://localhost:" + helper.getPort() + "/login", cb);
					},
					function (cb) {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/login");
						browser.fill("username", "testAdmin").fill("password", "testAdmin").pressButton("Login", cb);
					},
					function (cb) {
						browser.success.should.be.true;

						browser.window.location.pathname.should.eql("/overview");

						cb();
					}
				], done);
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
				it("should include a listing of the reports", function (done) {
					models.Report.remove({}, function (err, docs) {
						models.Report.count({}, function (err, docs) {
							docs.should.eql(0);

							browser.clickLink("Tracking", function () {
								browser.success.should.be.true;
								should.not.exist(browser.document.getElementById("tracking-listing"));

								// create n applications and test to confirm that the table shows up. 

								done();
							});
						});
					});
				});

				it("should include actions for each entry in the listing of reports", function (done) {

					helper.createSampleReports(20, function () {
						// create n applications and test to confirm that the table shows up. 
						browser.clickLink("Tracking", function () {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("reports-listing"));

							var table = helper.Table2Object(browser, "reports-listing");

							table.name.length.should.eql(table.actions.length);
							done();
						});
					});
				});

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

				it("should be able to view a report", function (done) {
					async.series([

						function (cb) {
							models.Report.remove({}, cb);
						},
						function (cb) {
							helper.createSampleReports(1, cb);
						},
						function (cb) {
							models.Report.findOne({}, function (err, report) {
								browser.visit("http://localhost:" + helper.getPort() + "/tracking/" + report._id, function () {
									browser.success.should.be.true;

									browser.window.location.pathname.should.startWith("/tracking/");
									browser.window.location.pathname.should.endWith(report._id.toString());

									var name = browser.document.getElementById("report-title");

									should.exist(name);
									name.innerHTML.should.eql(report.Name);
									cb();
								});
							});
						},
					], done);

				});
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
				it("should include a listing of the clients", function (done) {
					async.series([

						function (cb) {
							client.remove({}, cb);
						},
						function (cb) {
							browser.clickLink("Clients", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.not.exist(browser.document.getElementById("clients-listing"));
							cb();
						},
						function (cb) {
							helper.createSampleClients(20, cb);
						},
						function (cb) {
							browser.clickLink("Clients", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("clients-listing"));
							cb();
						}
					], done);
				});

				it("should include actions for each entry in the listing of clients", function (done) {
					async.series([

						function (cb) {
							client.remove({}, cb);
						},
						function (cb) {
							helper.createSampleClients(20, cb);
						},
						function (cb) {
							browser.clickLink("Clients", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("clients-listing"));

							var table = helper.Table2Object(browser, "clients-listing");

							table.uid.length.should.eql(table.actions.length);

							cb();
						}
					], done);
				});

				it("should be able to create a new client", function (done) {

					var testUID = "00000000002";

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

				it("should be able to view an client's overview", function (done) {
					async.series([

						function (cb) {
							client.remove({}, cb);
						},
						function (cb) {
							helper.createSampleClients(1, cb);
						},
						function (cb) {
							client.findOne({}, function (err, client) {
								browser.visit("http://localhost:" + helper.getPort() + "/clients/" + client._id, function () {
									browser.success.should.be.true;

									browser.window.location.pathname.should.startWith("/clients/");
									browser.window.location.pathname.should.endWith(client._id.toString());

									var name = browser.document.getElementById("client-uid");

									should.exist(name);
									name.innerHTML.should.eql(client.UID);
									cb();
								});
							});
						},
					], done);

				});

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
				it("should include a listing of the applications", function (done) {
					async.series([

						function (cb) {
							application.remove({}, cb);
						},
						function (cb) {
							browser.clickLink("Applications", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.not.exist(browser.document.getElementById("applications-listing"));
							cb();
						},
						function (cb) {
							helper.createSampleApplications(20, cb);
						},
						function (cb) {
							browser.clickLink("Applications", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("applications-listing"));
							cb();
						}
					], done);
				});

				it("should include actions for each entry in the listing of applications", function (done) {
					async.series([

						function (cb) {
							application.remove({}, cb);
						},
						function (cb) {
							helper.createSampleApplications(20, cb);
						},
						function (cb) {
							browser.clickLink("Applications", cb)
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("applications-listing"));

							var table = helper.Table2Object(browser, "applications-listing");

							table.name.length.should.eql(table.actions.length);

							cb();
						}
					], done);
				});

				it("should be able to create a new application", function (done) {

					var testName = "Exodus_Admin";

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

				it("should be able to view an application's overview", function (done) {
					async.series([

						function (cb) {
							application.remove({}, cb);
						},
						function (cb) {
							helper.createSampleApplications(1, cb);
						},
						function (cb) {
							application.findOne({}, function (err, app) {
								browser.visit("http://localhost:" + helper.getPort() + "/applications/" + app._id, function () {
									browser.success.should.be.true;

									browser.window.location.pathname.should.startWith("/applications/");
									browser.window.location.pathname.should.endWith(app._id.toString());

									var name = browser.document.getElementById("application-name");

									should.exist(name);
									name.innerHTML.should.eql(app.Name);
									cb();
								});
							});
						},
					], done);

				});

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
				it("should include a listing of the users", function (done) {
					async.series([

						function (cb) {
							browser.clickLink("Users", cb);
						},
						function (cb) {
							browser.success.should.be.true;
							should.exist(browser.document.getElementById("users-listing"));

							var table = helper.Table2Object(browser, "users-listing");
							user.find({}, function (err, users) {

								for (var i = 0; i < users.length; i++) {
									table.name.should.containEql(users[i].Name);
									table.email.should.containEql(users[i].Email);
									table.role.should.containEql(users[i].Role);
								};

								cb();
							});
						}
					], done);
				});

				it("should include actions for each entry in the listing of users", function (done) {
					browser.clickLink("Users", function () {
						browser.success.should.be.true;
						should.exist(browser.document.getElementById("users-listing"));

						var table = helper.Table2Object(browser, "users-listing");

						table.name.length.should.eql(table.actions.length);
						done();
					});
				});

				it("should be able to create a new manager", function (done) {

					var testName = "User43";
					var password = "User43";

					browser.clickLink("Users", function () {
						browser.fill("name", testName).select("role", "Manager").fill("email", testName + "@gneu.org").fill("password", password).fill("password-conf", password).pressButton("Create", function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/users/");
							browser.window.location.pathname.should.match(/\w+$/);

							var name = browser.document.getElementById("user-name");

							should.exist(name);
							name.innerHTML.should.eql(testName.toLowerCase());

							var path = browser.window.location.pathname.split("/");

							user.findOne({
								_id: models.ObjectId(path[2])
							}, function (err, res) {

								should.not.exist(err);
								should.exist(res);

								res.Name.should.eql(testName.toLowerCase());

								done();
							});
						});
					});
				});

				it("should be able to create a new administrator", function (done) {

					var testName = "Admin43";
					var password = "Admin43";

					browser.clickLink("Users", function () {
						browser.fill("name", testName).select("role", "Administrator").fill("email", testName + "@gneu.org").fill("password", password).fill("password-conf", password).pressButton("Create", function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/users/");
							browser.window.location.pathname.should.match(/\w+$/);

							var name = browser.document.getElementById("user-name");

							should.exist(name);
							name.innerHTML.should.eql(testName.toLowerCase());

							var path = browser.window.location.pathname.split("/");

							user.findOne({
								_id: models.ObjectId(path[2])
							}, function (err, res) {

								should.not.exist(err);
								should.exist(res);

								res.Name.should.eql(testName.toLowerCase());

								done();
							});
						});
					});
				});

				it("should be able to view a user's overview", function (done) {
					user.findOne({}, function (err, user) {
						browser.visit("http://localhost:" + helper.getPort() + "/users/" + user._id, function () {
							browser.success.should.be.true;

							browser.window.location.pathname.should.startWith("/users/");
							browser.window.location.pathname.should.match(/\w+$/);

							var name = browser.document.getElementById("user-name");

							should.exist(name);
							name.innerHTML.should.eql(user.Name);
							done();
						});
					});
				});

				it("should be able to delete a user", function (done) {
					this.timeout = 3000;

					var testName = "DeleteUser",
						password = "password",
						id = -1;

					async.series([

						function (cb) {
							browser.clickLink("Users", cb);
						},

						function (cb) {
							browser.fill("name", testName).select("role", "Administrator").fill("email", testName + "@gneu.org").fill("password", password).fill("password-conf", password).pressButton("Create", cb);
						},
						function (cb) {
							browser.success.should.be.true;

							var name = browser.document.getElementById("user-name");

							should.exist(name);
							name.innerHTML.should.eql(testName.toLowerCase());

							var path = browser.window.location.pathname.split("/");
							id = path[2];
							cb();
						},
						function (cb) {
							browser.clickLink("Users", cb);
						},
						function (cb) {
							browser.clickLink("[data-pk='" + id + "'][id^='user_delete']", cb);
						},
						function (cb) {
							browser.onconfirm("Are you sure?", true);
							cb();
						},
						function (cb) {
							browser.clickLink("Users", cb);
						},
						function (cb) {
							should.exist(browser.document.getElementById("users-listing"));

							var table = helper.Table2Object(browser, "users-listing");

							table.name.should.not.containEql(testName);

							cb();
						},
					], done);
				});
			});
		});
	});
});