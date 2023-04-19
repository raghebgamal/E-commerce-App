"use strict";

var express = require("express");

var router = express.Router();

var _require = require("./../controller/brandController"),
    createBrand = _require.createBrand,
    getAllBrands = _require.getAllBrands,
    updateBrand = _require.updateBrand,
    deleteBrand = _require.deleteBrand,
    getBrandById = _require.getBrandById,
    uploadBrandImage = _require.uploadBrandImage,
    resizeBrandImage = _require.resizeBrandImage;

var _require2 = require("./../utils/validatorRules/brandValidator"),
    getBrandValidatorById = _require2.getBrandValidatorById,
    createBrandValidator = _require2.createBrandValidator,
    updateBrandValidatorById = _require2.updateBrandValidatorById,
    deleteBrandValidatorById = _require2.deleteBrandValidatorById;

router.route("/").post(uploadBrandImage, resizeBrandImage, createBrandValidator, createBrand).get(getAllBrands);
router.route("/:id").get(getBrandValidatorById, getBrandById).patch(uploadBrandImage, resizeBrandImage, updateBrandValidatorById, updateBrand)["delete"](deleteBrandValidatorById, deleteBrand);
module.exports = router;