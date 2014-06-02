var express = require('express');
var router = express.Router();

var Services = {
	"auth": {
		"POST": {
			"Parameters": ["AppID"],
			"Returns": "Authorization object - JSON"
		}
	}
};

router.param('application', function (req, res, next, id) {
	req.params["application"] = id;
	next();
});

router.param('internal', function (req, res, next, id) {
	req.params["internal"] = (id === "true" ? true : false);
	next();
});

router.param('user', function (req, res, next, id) {
	req.params["user"] = id;
	next();
});

router.get('/', function (req, res) {
	res.type('json');
	res.send(JSON.stringify(Services, null, "\t"));
});

router.post("/auth/:application/:internal/:user", function (req, res) {
	var response = {};

	if (req.params.application === 'exodus' && req.params.user === 'test') {
		response = {
			allowGame: true,
			allowEditor: true
		};

	} else {
		response = {
			allowGame: false,
			allowEditor: false
		};
	}

	res.type('json');
	res.send(JSON.stringify(response, null, "\t"));
});

module.exports = router;