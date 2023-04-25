const path = require("path")

const express = require("express");
const dotenv = require("dotenv").config({ path: "config.env" });
const morgan = require("morgan");

const mountRoutes=require("./routs")


const database_Connection = require("./config-db/database");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");

const app = express();

database_Connection()

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

mountRoutes(app);


app.all("*", (req, res, next) => {
  next(new ApiError(`can not find this route ${req.originalUrl}`, 400));
});

//handle error for express
app.use(globalError);

module.exports = app;
