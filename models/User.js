var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const saltRounds = 13;

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  zipCode: {
    type: Number,
    maxlength: 5,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

userSchema.pre('save', function(next) {
  var user = this;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

var User = mongoose.model('User', userSchema);
module.exports = User;
