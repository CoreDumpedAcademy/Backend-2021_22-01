require('./config');

const mongoose = require('mongoose');
const app = require('./app');

const mongodb = process.env.MONGODB || 'mongodb://localhost:27017/API';
const port = process.env.PORT || 3000;

mongoose.set('useCreateIndex', true);

mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) console.log(`ERROR: connecting to Database. ${err}`);
  else app.listen(port, console.log(`API started on: http://localhost:${port}`));
});

module.exports = app;
