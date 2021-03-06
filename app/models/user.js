var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var schema = mongoose.Schema;

var userSchema = schema ({
  username: { type: String, required: true, index: {unique: true} },
  password: { type: String, required: true },
});

var User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
  // User.hashPassword(next);
});

User.comparePassword = function(attemptedPassword, savedPassword, callback) {
  bcrypt.compare(attemptedPassword, savedPassword, function(err, isMatch) {
    if (err) { 
      return callback(err);
    }
    callback(null, isMatch);
  });
};
// User.hashPassword = function(next) {
//   var cipher = Promise.promisify(bcrypt.hash);
//   return cipher(this.password, null, null).bind(this)
//     .then(function(hash) {
//       this.password = hash;
//       next();
//     });
// };

module.exports = User;
