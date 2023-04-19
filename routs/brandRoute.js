const express = require("express");
const router = express.Router();
const auth = require("./../controller/authController");

const {
  createBrand,
  getAllBrands,
  updateBrand,
  deleteBrand,
  getBrandById,
  uploadBrandImage,
  resizeBrandImage
} = require("./../controller/brandController");

const {
  getBrandValidatorById,
  createBrandValidator,
  updateBrandValidatorById,
  deleteBrandValidatorById,
} = require("./../utils/validatorRules/brandValidator");


router
  .route("/")
  .post(auth.protect,auth.allowedTo("admin","manager"),uploadBrandImage,resizeBrandImage, createBrandValidator, createBrand)
  .get(getAllBrands);

router
  .route("/:id")
  .get(getBrandValidatorById, getBrandById)
  .patch(auth.protect,auth.allowedTo("admin","manager"),uploadBrandImage,resizeBrandImage,updateBrandValidatorById, updateBrand)
  .delete(auth.protect,auth.allowedTo("admin","manager"),deleteBrandValidatorById, deleteBrand);

module.exports = router;
