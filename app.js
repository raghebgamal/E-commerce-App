const path = require("path")
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv").config({ path: "config.env" });
const morgan = require("morgan");
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const mountRoutes=require("./routs")


const database_Connection = require("./config-db/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const app = express();
app.use(cors());
app.options("*", cors());


app.use(compression())

database_Connection()

app.use(express.json({limit:"20kb"}));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(mongoSanitize());
app.use(xss());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
		'Too many requests created from this IP, please try again after 15 minutes',
})

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

app.use(hpp({
  whitelist: [
    'duration',
      'maxGroupSize',
      'difficulty',
    'price',
      'sold',
      'quantity',
      'ratingsAverage',
  'ratingsQuantity',]
}));
      
mountRoutes(app);


app.all("*", (req, res, next) => {
  next(new ApiError(`can not find this route ${req.originalUrl}`, 400));
});

//handle error for express
app.use(globalError);

module.exports = app;
