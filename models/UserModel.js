var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const saltRounds = 13;

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    index:  true,
    unique:  true,
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

// userSchema.methods.comparePassword = function(plainTextPassword, callback) {
//   bcrypt.compare(plainTextPassword, this.password, function(err, isMatch) {
//     if (err) return callback(err);
//     callback(undefined, isMatch);
//   });
// };

// userSchema.methods.loginRegistrant = function(email) {
  // User.findOne({'email': this.email}, 'email', function(err, dbEmail) {
  //   if (err) return err;
  //   console.log(dbEmail);
  //   console.log(this.email);
  // });
// };

module.exports = User;
