var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var clientSchema = new Schema({
	name: { type: String },
	email: { type: String },
	contact_number: { type: String },
	coordinator: { type: Schema.Types.ObjectId, ref : 'sales' },
	status: { type: String },
	comment:[{ type: Schema.Types.ObjectId, ref: 'comment'}],
	communication_medium: { type: Schema.Types.ObjectId, ref : 'communication' },
	logo: { type: String },
	priority: { type: Number },
	timelog:[{
		operation: {type: String},
		dateTime: {type: Date},
		operatedBy: {type: Schema.Types.ObjectId, ref: 'sales'},
		_id: false
	}],
}, {timestamps: true});


module.exports = mongoose.model('client', clientSchema);