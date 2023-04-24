const express = require("express");
const router = express.Router();
const auth = require("./../controller/authController");
const reviewRouter = require("./../routs/reviewRoute");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  uploadProductImage,
  resizeProductImages
} = require("./../controller/productController");
//const subCategoryRouter = require("./../routs/subCategoryRoute");

const {
  getProductValidatorById,
  createProductValidator,
  updateProductValidatorById,
  deleteProductValidatorById,
} = require("./../utils/validatorRules/productValidator");

router.use("/:productId/reviews", reviewRouter);

router
  .route("/")
  .post(auth.protect,auth.allowedTo("admin","manager"),uploadProductImage,resizeProductImages,createProductValidator, createProduct)
  .get(getAllProducts);

router
  .route("/:id")
  .get(getProductValidatorById, getProductById)
  .patch(auth.protect,auth.allowedTo("admin","manager"),uploadProductImage,resizeProductImages,updateProductValidatorById, updateProduct)
  .delete(auth.protect,auth.allowedTo("admin","manager"),deleteProductValidatorById, deleteProduct);

module.exports = router;
