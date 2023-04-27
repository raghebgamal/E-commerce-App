"use strict";

var path = require("path");

var cors = require("cors");

var express = require("express");

var dotenv = require("dotenv").config({
  path: "config.env"
});

var morgan = require("morgan");

var compression = require('compression');

var rateLimit = require('express-rate-limit');

var hpp = require('hpp');

var mongoSanitize = require('express-mongo-sanitize');

var xss = require('xss-clean');

var mountRoutes = require("./routs");

var database_Connection = require("./config-db/database");

var ApiError = require("./utils/apiError");

var globalError = require("./middlewares/errorMiddleware");

var app = express();
app.use(cors());
app.options("*", cors());
app.use(compression());
database_Connection();
app.use(express.json({
  limit: "20kb"
}));
app.use(express["static"](path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(mongoSanitize());
app.use(xss());
var limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  // 15 minutes
  max: 100,
  message: 'Too many requests created from this IP, please try again after 15 minutes'
}); // Apply the rate limiting middleware to all requests

app.use("/api", limiter);
app.use(hpp({
  whitelist: ['duration', 'maxGroupSize', 'difficulty', 'price', 'sold', 'quantity', 'ratingsAverage', 'ratingsQuantity']
}));
mountRoutes(app);
app.all("*", function (req, res, next) {
  next(new ApiError("can not find this route ".concat(req.originalUrl), 400));
}); //handle error for express

app.use(globalError);
module.exports = app;