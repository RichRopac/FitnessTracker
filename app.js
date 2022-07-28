require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const client = require("./db/client");
client.connect();

app.use(cors());

// Setup your Middleware and API Router here
app.use(express.json());
app.use(morgan("dev"));

const apiRouter = require("./api");
app.use("/api", apiRouter);

// error handling goes here

module.exports = app;
