const mongoose = require('mongoose');
const { pbkdf2Sync, randomBytes } = require('crypto');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String, unique: true, immutable: true, required: [true, 'email required'],
  },
  password: { type: String, required: [true, 'password required'] },
  salt: { type: String },
  name: { type: String, required: [true, 'name required'] },
  surname: { type: String, required: [true, 'surname required'] },
  avatarImage: { type: String },
  phone: { type: String, minLength: 9, maxLength: 9 },
  signUpDate: { type: Date, default: Date.now() },
  isAdmin: { type: Boolean, immutable: true, default: false },
});

function hashPassword(next) {
  const user = this;

  user.salt = randomBytes(16).toString('hex');

  if (user.isModified('password')) {
    user.password = pbkdf2Sync(user.password, user.salt, 100000, 64, 'sha512').toString('hex');
  }

  return next();
}

function comparePassword(password) {
  const user = this;

  return user.password === pbkdf2Sync(password, user.salt, 100000, 64, 'sha512').toString('hex');
}

userSchema.pre('save', hashPassword);
userSchema.methods.comparePassword = comparePassword;

module.exports = mongoose.model('User', userSchema);
