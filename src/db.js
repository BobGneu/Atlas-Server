var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ApplicationModel = mongoose.model('Application', new Schema({
	Name: {
		type: String,
		required: true,
		lowercase: true
	}
}));

var UserModel = mongoose.model('User', new Schema({
	Name: {
		type: String,
		required: true,
		lowercase: true
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
	}
}));

var TrackingDataModel = mongoose.model('TrackingData', new Schema({
	Name: {
		type: String,
		required: true,
		lowercase: true
	}
}));

mongoose.connect('mongodb://localhost/atlas');

exports.Application = ApplicationModel;
exports.User = UserModel;
exports.TrackingData = TrackingDataModel;