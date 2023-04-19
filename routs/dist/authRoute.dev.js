"use strict";

var express = require("express");

var router = express.Router();

var auth = require("./../controller/authController");

var _require = require("./../utils/validatorRules/authValidator"),
    signUpUserValidator = _require.signUpUserValidator,
    loginUserValidator = _require.loginUserValidator,
    resetPasswordValidator = _require.resetPasswordValidator;

router.route("/signup").post(signUpUserValidator, auth.sign_up);
router.route("/login").post(loginUserValidator, auth.login);
router.route("/forgetPassword").post(auth.forgotPassword);
router.route("/resetPassword").post(resetPasswordValidator, auth.resetPassword);
router.route("/verifyResetToken").post(auth.verifyResetToken);
router.route("/logout").get(auth.protect, auth.logout);
router.route("/logoutAll").get(auth.protect, auth.logoutAll);
module.exports = router;