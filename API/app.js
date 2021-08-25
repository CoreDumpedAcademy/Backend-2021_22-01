const express = require('express');
const userRoutes = require('./routes/userRoutes');
const todoListRoutes = require('./routes/todoListRoutes');

const app = express();
const options = {
  Origin: '*',
  Headers: '*',
  Methods: 'GET, POST, OPTIONS, PUT, DELETE',
  Allow: 'GET, POST, OPTIONS, PUT, DELETE',
};

app.use((request, response, next) => {
  response.header(options);
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/user', userRoutes);
app.use('/todoList', todoListRoutes);

module.exports = app;
