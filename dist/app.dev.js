"use strict";

var path = require("path");

var express = require("express");

var dotenv = require("dotenv").config({
  path: "config.env"
});

var morgan = require("morgan");

var categoryRouter = require("./routs/categoryRoute");

var subCategoryRouter = require("./routs/subCategoryRoute");

var brandRouter = require("./routs/brandRoute");

var productRouter = require("./routs/productRoute");

var userRouter = require("./routs/userRoute");

var authRouter = require("./routs/authRoute");

var reviewRouter = require("./routs/reviewRoute");

var wishlistRouter = require('./routs/wishlistRoute');

var addressRouter = require('./routs/addressRoute');

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

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/addresses', addressRouter);
app.all("*", function (req, res, next) {
  next(new ApiError("can not find this route ".concat(req.originalUrl), 400));
}); //handle error for express

app.use(globalError);
module.exports = app;