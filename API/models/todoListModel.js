const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  title: { type: String, unique: true, required: [true, 'title required'] },
  description: { type: String, maxLength: 2000 },
  dueDate: { type: Date, min: Date.now() },
});

module.exports = mongoose.model('TodoList', userSchema);
