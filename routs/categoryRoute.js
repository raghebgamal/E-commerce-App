const express = require("express");
const router = express.Router();
const controller = require("./../controller/categoryController");
const subCategoryRouter = require("./../routs/subCategoryRoute");
const auth = require("./../controller/authController");
const {
  getCategoryValidatorById,
  createCategoryValidator,
  updateCategoryValidatorById,
  deleteCategoryValidatorById,
} = require("./../utils/validatorRules/categoryValidator");


router.use("/:categoryId/subCategories", subCategoryRouter);

router
  .route("/")
  .post(auth.protect,auth.allowedTo("admin","manager"),controller.uploadCategoryImage,controller.resizeCategoryImage, createCategoryValidator, controller.createCategory)
  .get(controller.getAllCategories);

router
  .route("/:id")
  .get(getCategoryValidatorById, controller.getCategoryById)
  .patch(auth.protect,auth.allowedTo("admin","manager"),controller.uploadCategoryImage,controller.resizeCategoryImage,updateCategoryValidatorById, controller.updateCategory)
  .delete(auth.protect,auth.allowedTo("admin","manager"),deleteCategoryValidatorById, controller.deleteCategory);

module.exports = router;
