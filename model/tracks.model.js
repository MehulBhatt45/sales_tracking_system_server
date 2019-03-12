var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tracksSchema = new Schema({
	title: { type: String },
	trackId: { type: String },
	tasks: { typr: Array, default: [] }
}, {timestamps: true});


module.exports = mongoose.model('track', tracksSchema);