"use strict";

var express = require("express");

var router = express.Router();

var auth = require("./../controller/authController");

var reviewRouter = require("./../routs/reviewRoute");

var _require = require("./../controller/productController"),
    createProduct = _require.createProduct,
    getAllProducts = _require.getAllProducts,
    updateProduct = _require.updateProduct,
    deleteProduct = _require.deleteProduct,
    getProductById = _require.getProductById,
    uploadProductImage = _require.uploadProductImage,
    resizeProductImages = _require.resizeProductImages; //const subCategoryRouter = require("./../routs/subCategoryRoute");


var _require2 = require("./../utils/validatorRules/productValidator"),
    getProductValidatorById = _require2.getProductValidatorById,
    createProductValidator = _require2.createProductValidator,
    updateProductValidatorById = _require2.updateProductValidatorById,
    deleteProductValidatorById = _require2.deleteProductValidatorById;

router.use("/:productId/reviews", reviewRouter);
router.route("/").post(auth.protect, auth.allowedTo("admin", "manager"), uploadProductImage, resizeProductImages, createProductValidator, createProduct).get(getAllProducts);
router.route("/:id").get(getProductValidatorById, getProductById).patch(auth.protect, auth.allowedTo("admin", "manager"), uploadProductImage, resizeProductImages, updateProductValidatorById, updateProduct)["delete"](auth.protect, auth.allowedTo("admin", "manager"), deleteProductValidatorById, deleteProduct);
module.exports = router;