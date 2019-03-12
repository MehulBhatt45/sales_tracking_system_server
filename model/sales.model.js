var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10;
var Schema = mongoose.Schema;

var salesSchema = new Schema({
	name: { type: String },
	email: { type: String },
	password: { type: String },
	role: { type: String },
	joiningDate: { type: Date },
	experience:{ type: String },
	profilePhoto: { type: String },
	CV: { type: String },
	clients:[{type:Schema.Types.ObjectId, ref: 'Project'}],
});

salesSchema.pre('save', function(next) {
    var user = this;
    console.log("=====================>", user);
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            console.log(hash);
            user.password = hash;
            next();
        });
    });
});

salesSchema.methods.comparePassword = function(userPassword, cb) {
    bcrypt.compare(userPassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('sales', salesSchema)