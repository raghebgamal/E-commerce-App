const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("./../controller/authController");

const {
  createSubCategory,
  getAllSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createfilterObject,
} = require("./../controller/subCategoryController");
const {
  createSubCategoryValidator,
  getSubCategoryValidatorById,
  updateSubCategoryValidatorById,
  deleteSubCategoryValidatorById,
} = require("./../utils/validatorRules/subCategoryValidator");
router
  .route("/")
  .post(auth.protect,auth.allowedTo("admin","manager"),setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createfilterObject, getAllSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidatorById, getSubCategoryById)
  .patch(auth.protect,auth.allowedTo("admin","manager"),updateSubCategoryValidatorById, updateSubCategory)
  .delete(auth.protect,auth.allowedTo("admin","manager"),deleteSubCategoryValidatorById, deleteSubCategory);

module.exports = router;
