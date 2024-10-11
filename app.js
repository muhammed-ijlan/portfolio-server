// Imports
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const { mogoDBConection } = require('./configs/_index');
var parser = require('ua-parser-js');

// app creation
const app = express();


// Configure mongo connection
mogoDBConection.connect();

const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify headers
  credentials: true, // Set to false if you don't need credentials (cookies, auth headers)
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly (if necessary)
app.options('*', cors(corsOptions));



//body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use('/public', express.static(path.join(__dirname, 'public')));



//user agent
app.use(function (req, res, next) {
  req.useragent = parser(req.headers['user-agent']);
  next();
});


//Static public File access
app.use('/public', express.static(path.join(__dirname, 'public')));




// Routing happens here
require('./routes/_index')(app);


//Schedulers
require("./cronJobs/schedulers");

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
  console.log(chalk.red("ERROR=====================================> START"));
  console.log(err);
  console.log(chalk.red("ERROR=====================================> END"));

  res.status(err.status || 500);
  res.setHeader('Content-Type', 'application/json');
  res.json({ message: err.message || "Internal Server Error", error: true, errors: err.errors || [] });
});

module.exports = app;
