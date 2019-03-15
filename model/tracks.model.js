var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tracksSchema = new Schema({
	title: { type: String, unique: true },
	trackId: { type: String, unique: true },
	tasks: { type: Array, default: [] },
	index: { type: Number }
}, {timestamps: true});


module.exports = mongoose.model('track', tracksSchema);