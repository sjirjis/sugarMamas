var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
const saltRounds = 13;

var userSchema = mongoose.Schema({
  email: {
    type: String,
    index:  true,
    unique:  true,
    required: true,
    trim: true
  },
  // zipCode: {
  //   type: Number,
  //   maxlength: 5,
  //   required: true,
  //   trim: true
  // },
  password: {
    type: String,
    required: true
  },
  lastUpdateDate: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
