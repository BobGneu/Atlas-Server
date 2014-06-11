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
		Default: "Manager"
	}
}));

exports.User.prototype.validPassword = function (pw) {
	if (typeof (pw) !== "string" || pw.length === 0) {
		return false;
	}

	return passwordHash.verify(pw, this.PasswordHash)
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