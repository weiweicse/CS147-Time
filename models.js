var Mongoose = require('mongoose');

var RecordSchema = new Mongoose.Schema({
	'user': String,
	'task': String,
	'from': Date,
	'to': Date
});

exports.Record = Mongoose.model('Record', RecordSchema);
