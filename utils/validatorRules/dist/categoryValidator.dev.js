"use strict";

var _require = require('express-validator'),
    check = _require.check;

var validatorMiddleware = require("./../../middlewares/validatorMiddleware");

exports.getCategoryValidatorById = [check("id").isMongoId().withMessage("invalid category id format"), validatorMiddleware];
exports.createCategoryValidator = [check("name").notEmpty().withMessage("category name requierd").isLength({
  min: 3
}).withMessage("too short category name").isLength({
  max: 32
}).withMessage("too long category name"), validatorMiddleware];
exports.updateCategoryValidatorById = [check("id").isMongoId().withMessage("invalid category id format"), check("name").notEmpty().withMessage("category name requierd").isLength({
  min: 3
}).withMessage("too short category name").isLength({
  max: 32
}).withMessage("too long category name"), validatorMiddleware];
exports.deleteCategoryValidatorById = [check("id").isMongoId().withMessage("invalid category id format"), validatorMiddleware];