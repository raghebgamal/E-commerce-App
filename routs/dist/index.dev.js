"use strict";

var categoryRouter = require("./categoryRoute");

var subCategoryRouter = require("./subCategoryRoute");

var brandRouter = require("./brandRoute");

var productRouter = require("./productRoute");

var userRouter = require("./userRoute");

var authRouter = require("./authRoute");

var reviewRouter = require("./reviewRoute");

var wishlistRouter = require('./wishlistRoute');

var addressRouter = require('./addressRoute');

var couponRouter = require('./couponRoute');

var cartRouter = require('./cartRoute');

var mountRoutes = function mountRoutes(app) {
  app.use("/api/v1/categories", categoryRouter);
  app.use("/api/v1/subCategories", subCategoryRouter);
  app.use("/api/v1/brands", brandRouter);
  app.use("/api/v1/products", productRouter);
  app.use("/api/v1/users", userRouter);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/reviews", reviewRouter);
  app.use('/api/v1/wishlist', wishlistRouter);
  app.use('/api/v1/addresses', addressRouter);
  app.use('/api/v1/coupons', couponRouter);
  app.use('/api/v1/cart', cartRouter);
};

module.exports = mountRoutes;