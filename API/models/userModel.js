const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: [true, 'email required'] },
  password: { type: String, required: [true, 'password required'] },
  name: { type: String, required: [true, 'name required'] },
  surname: { type: String, required: [true, 'surname required'] },
  avatarImage: { type: String },
  phone: { type: String, minLength: 9, maxLength: 9 },
  signUpDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('User', userSchema);
