var mongoose = require('mongoose');

var Schema = mongoose.Schema;

exports.Application = mongoose.model('Application', new Schema({
	Name: {
		type: String,
		required: true,
		lowercase: true,
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
		select: false,
		required: true,
		lowercase: true
	},
	UID: {
		type: String,
		required: true
	}
}));

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