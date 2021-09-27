const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
const options = {
  Origin: '*',
  Headers: '*',
  Methods: 'GET, POST, OPTIONS, PUT, DELETE',
  Allow: 'GET, POST, OPTIONS, PUT, DELETE',
};

app.use((response, next) => {
  response.header(options);
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/user', userRoutes);

module.exports = app;
