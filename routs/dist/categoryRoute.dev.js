"use strict";

var express = require("express");

var router = express.Router();

var controller = require("./../controller/categoryController");

var subCategoryRouter = require("./../routs/subCategoryRoute");

var auth = require("./../controller/authController");

var _require = require("./../utils/validatorRules/categoryValidator"),
    getCategoryValidatorById = _require.getCategoryValidatorById,
    createCategoryValidator = _require.createCategoryValidator,
    updateCategoryValidatorById = _require.updateCategoryValidatorById,
    deleteCategoryValidatorById = _require.deleteCategoryValidatorById;

router.use("/:categoryId/subCategories", subCategoryRouter);
router.route("/").post(controller.uploadCategoryImage, controller.resizeCategoryImage, createCategoryValidator, controller.createCategory).get(auth.protect, controller.getAllCategories);
router.route("/:id").get(getCategoryValidatorById, controller.getCategoryById).patch(controller.uploadCategoryImage, controller.resizeCategoryImage, updateCategoryValidatorById, controller.updateCategory)["delete"](deleteCategoryValidatorById, controller.deleteCategory);
module.exports = router;