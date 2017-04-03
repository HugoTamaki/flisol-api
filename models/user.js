var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var q = require('q');

var UserSchema = new Schema({
  email: String,
  password: String
});

UserSchema.statics.validPassword = function validPassword(rawPassword, user) {
  var deferred = q.defer()

  if (user) {
    bcrypt.compare(rawPassword, user.password)
      .then(function(res) {
        if (res) {
          deferred.resolve(res)
        } else {
          deferred.reject(res)
        }
      })
  } else {
    deferred.reject(res);
  }


  return deferred.promise
}

module.exports = mongoose.model('User', UserSchema);