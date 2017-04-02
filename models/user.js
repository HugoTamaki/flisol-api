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

  bcrypt.compare(rawPassword, user.password)
    .then(function(res) {
      deferred.resolve(res)
    })

  return deferred.promise
}

module.exports = mongoose.model('User', UserSchema);