require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const router = require('./api');
const client = require('./db/client');
// Setup your Middleware and API Router here
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', router);
client.connect();
// error handling goes here
router.use((req, res, next) => {
  if (req.user) {
    console.log('User is set:', req.user);
  }
  next();
});
router.use((error, req, res, next) => {
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
  });
});
module.exports = app;