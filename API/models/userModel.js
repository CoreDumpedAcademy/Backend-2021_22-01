/* eslint-disable func-names */
const mongoose = require('mongoose');
const { pbkdf2Sync, randomBytes } = require('crypto');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: [true, 'email required'] },
  password: { type: String, required: [true, 'password required'] },
  salt: { type: String },
  name: { type: String, required: [true, 'name required'] },
  surname: { type: String, required: [true, 'surname required'] },
  avatarImage: { type: String },
  phone: { type: String, minLength: 9, maxLength: 9 },
  signUpDate: { type: Date, default: Date.now() },
});

function hashPassword(next) {
  const user = this;
  user.salt = randomBytes(16).toString('hex');

  if (user.isModified('password')) {
    user.password = pbkdf2Sync(user.password, user.salt, 100000, 64, 'sha512').toString('hex');
  }

  return next();
}

userSchema.pre('save', hashPassword);

userSchema.methods.comparePassword = function (password) {
  const user = this;

  return user.password === pbkdf2Sync(password, user.salt, 100000, 64, 'sha512').toString('hex');
};

module.exports = mongoose.model('User', userSchema);
