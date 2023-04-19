const path = require("path")

const express = require("express");
const dotenv = require("dotenv").config({ path: "config.env" });
const morgan = require("morgan");

const categoryRouter = require("./routs/categoryRoute");
const subCategoryRouter = require("./routs/subCategoryRoute");
const brandRouter = require("./routs/brandRoute");
const productRouter = require("./routs/productRoute");
const userRouter = require("./routs/userRoute");
const authRouter = require("./routs/authRoute");

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

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/subCategories", subCategoryRouter);
app.use("/api/v1/brands", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

app.all("*", (req, res, next) => {
  next(new ApiError(`can not find this route ${req.originalUrl}`, 400));
});

//handle error for express
app.use(globalError);

module.exports = app;
