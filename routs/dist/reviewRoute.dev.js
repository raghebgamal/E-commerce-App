"use strict";

var express = require("express");

var router = express.Router({
  mergeParams: true
});

var auth = require("./../controller/authController");

var _require = require("./../controller/reviewController"),
    createReview = _require.createReview,
    updateReview = _require.updateReview,
    getAllReviews = _require.getAllReviews,
    deleteReview = _require.deleteReview,
    getReview = _require.getReview,
    setProductIdAndUserIdToBody = _require.setProductIdAndUserIdToBody,
    createFilterObj = _require.createFilterObj;

var _require2 = require("./../utils/validatorRules/reviewValidator"),
    createReviewValidator = _require2.createReviewValidator,
    updateReviewValidator = _require2.updateReviewValidator,
    deleteReviewValidator = _require2.deleteReviewValidator,
    getReviewValidator = _require2.getReviewValidator;

router.route("/").post(auth.protect, auth.allowedTo("user"), setProductIdAndUserIdToBody, createReviewValidator, createReview).get(createFilterObj, getAllReviews);
router.route("/:id").get(getReviewValidator, getReview).patch(auth.protect, auth.allowedTo("user"), updateReviewValidator, updateReview)["delete"](auth.protect, auth.allowedTo("user", "admin"), deleteReviewValidator, deleteReview);
module.exports = router;