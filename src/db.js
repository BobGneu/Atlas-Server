var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ApplicationModel = mongoose.model('Application', new Schema({
	Name: String
}));

var UserModel = mongoose.model('User', new Schema({
	Name: String,
	PasswordHash: String
}));

var TrackingDataModel = mongoose.model('TrackingData', new Schema({
	Name: String
}));

mongoose.connect('mongodb://localhost/atlas');