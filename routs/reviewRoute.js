const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("./../controller/authController");

const {
  createReview,
  updateReview,
  getAllReviews,
  deleteReview,
  getReview,
  setProductIdAndUserIdToBody,
  createFilterObj
} = require("./../controller/reviewController");
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
  getReviewValidator
} = require("./../utils/validatorRules/reviewValidator");




router
  .route("/")
  .post(auth.protect,auth.allowedTo("user"),setProductIdAndUserIdToBody,createReviewValidator,createReview)
  .get(createFilterObj,getAllReviews);

router
  .route("/:id")
  .get(getReviewValidator,getReview)
  .patch(auth.protect,auth.allowedTo("user"),updateReviewValidator,updateReview)
  .delete(auth.protect,auth.allowedTo("user","admin"),deleteReviewValidator,deleteReview);

module.exports = router;
