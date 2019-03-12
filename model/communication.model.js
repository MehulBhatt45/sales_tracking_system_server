var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var communicationSchema = new Schema({
	name: { type: String },
	verified: { type: Boolean, default: false }
})

module.exports = mongoose.model('communication', communicationSchema)