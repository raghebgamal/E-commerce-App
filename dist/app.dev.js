"use strict";

var path = require("path");

var express = require("express");

var dotenv = require("dotenv").config({
  path: "config.env"
});

var morgan = require("morgan");

var mountRoutes = require("./routs");

var database_Connection = require("./config-db/database");

var ApiError = require("./utils/apiError");

var globalError = require("./middlewares/errorMiddleware");

var app = express();
database_Connection();
app.use(express.json());
app.use(express["static"](path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

mountRoutes(app);
app.all("*", function (req, res, next) {
  next(new ApiError("can not find this route ".concat(req.originalUrl), 400));
}); //handle error for express

app.use(globalError);
module.exports = app;