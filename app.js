require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const apiRouter = require('./api');
const client = require('./db/client');

// Setup your Middleware and API Router here
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use('/api', apiRouter);
client.connect();

// error handling goes here

module.exports = app;
