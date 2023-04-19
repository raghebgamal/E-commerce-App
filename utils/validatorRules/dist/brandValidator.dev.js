"use strict";

var _require = require("express-validator"),
    check = _require.check;

var validatorMiddleware = require("./../../middlewares/validatorMiddleware");

exports.getBrandValidatorById = [check("id").isMongoId().withMessage("invalid brand id format"), validatorMiddleware];
exports.createBrandValidator = [check("name").notEmpty().withMessage("brand name requierd").isLength({
  min: 3
}).withMessage("too short brand name").isLength({
  max: 32
}).withMessage("too long brand name"), validatorMiddleware];
exports.updateBrandValidatorById = [check("id").isMongoId().withMessage("invalid brand id format"), check("name").notEmpty().withMessage("brand name requierd").isLength({
  min: 3
}).withMessage("too short brand name").isLength({
  max: 32
}).withMessage("too long brand name"), validatorMiddleware];
exports.deleteBrandValidatorById = [check("id").isMongoId().withMessage("invalid brand id format"), validatorMiddleware];