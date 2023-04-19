const express = require("express");
const router = express.Router();

const auth=require("./../controller/authController")

const {
  signUpUserValidator,
  loginUserValidator,
  resetPasswordValidator
} = require("./../utils/validatorRules/authValidator");

router
  .route("/signup")
  .post(signUpUserValidator,auth.sign_up);
router
    .route("/login")
  .post(loginUserValidator, auth.login);
    router
    .route("/forgetPassword")
  .post(auth.forgotPassword);

  router
    .route("/resetPassword")
    .post( resetPasswordValidator,auth.resetPassword);
router
    .route("/verifyResetToken")
    .post( auth.verifyResetToken);
router
    .route("/logout")
  .get(auth.protect, auth.logout);
    
  router
    .route("/logoutAll")
    .get( auth.protect,auth.logoutAll);

 

module.exports = router;
