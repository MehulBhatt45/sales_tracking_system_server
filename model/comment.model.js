var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var CommentSchema = new Schema({

	content: String,
	userId: { type: Schema.Types.ObjectId, ref: 'sales'},
	clientId: { type: Schema.Types.ObjectId, ref: 'client'},
	postedOn: { type: Date, default: Date.now },
	images: [{type: String, default: []}]
},{timestamps: true})

// CommentSchema.pre('find', function(next) {	
// 	this.populate('issueId');
// 	next();

// });
module.exports = mongoose.model('Comment',CommentSchema);