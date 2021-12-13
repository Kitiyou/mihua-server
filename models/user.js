const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = Schema({
  username: String,
  nickname: String,
  password: String
});

const User = mongoose.model('users', userSchema);

module.exports = User;
