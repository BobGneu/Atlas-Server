(function (module) {
	'use strict';
	var mongoose = require('mongoose');
	var passwordHash = require('password-hash');

	var Schema = mongoose.Schema;

	exports.Application = mongoose.model('Application', new Schema({
		Name: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		AllowGame: {
			type: Boolean,
			default: false
		},
		AllowEditor: {
			type: Boolean,
			default: false
		}
	}));

	exports.Client = mongoose.model('Client', new Schema({
		UID: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		AllowGame: {
			type: Boolean,
			default: false
		},
		LastLogin: {
			type: Date,
			default: Date.now()
		},
		LastApplication: {
			type: String
		},
		LastIP: {
			type: String
		},
		SessionID: {
			type: String
		},
		Auths: {
			type: Number,
			default: 1
		},
		AllowEditor: {
			type: Boolean,
			default: false
		}
	}));

	exports.Report = mongoose.model('Report', new Schema({
		Name: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		}
	}));

	exports.Event = mongoose.model('Event', new Schema({
		SessionID: {
			type: String,
			required: true
		},
		ApplicationID: {
			type: String,
			required: true
		},
		Platform: {
			type: String,
			required: true
		},
		Version: {
			type: String,
			required: true
		},
		Name: {
			type: String,
			required: true
		},
		Date: {
			type: Date,
			default: Date.now()
		},
		Data: {
			type: Schema.Types.Mixed
		}
	}));

	exports.User = mongoose.model('User', new Schema({
		Name: {
			type: String,
			required: true,
			lowercase: true,
			index: {
				unique: true
			}
		},
		Email: {
			type: String,
			required: true,
			lowercase: true
		},
		PasswordHash: {
			type: String,
			required: true,
			lowercase: true
		},
		Role: {
			type: String,
			Default: 'Manager'
		},
		CreateDate: {
			type: Date,
			default: Date.now()
		},
		LastLogin: {
			type: Date,
			default: null
		}
	}));

	exports.User.prototype.validPassword = function (pw) {
		if (typeof (pw) !== 'string' || pw.length === 0) {
			return false;
		}

		return passwordHash.verify(pw, this.PasswordHash);
	};

	exports.User.prototype.completeLogin = function () {
		exports.User.findOne(this._id, function (err, user) {
			user.LastLogin = Date.now();

			user.save();
		});
	};

	exports.TrackingData = mongoose.model('TrackingData', new Schema({
		Name: {
			type: String,
			required: true,
			lowercase: true,
			index: {
				unique: true
			}
		}
	}));

	exports.ObjectId = mongoose.Types.ObjectId;

	if (process.env.NODE_ENV === 'production') {
		mongoose.connect('mongodb://localhost/atlas');
	} else if (process.env.NODE_ENV === 'testing') {
		mongoose.connect('mongodb://localhost/atlas_testing');
	} else {
		mongoose.connect('mongodb://localhost/atlas_dev');
	}
})();
