"use strict";

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var express = require("express");

var router = express.Router();

var auth = require("./../controller/authController");

var _require = require("./../controller/userController");

_objectDestructuringEmpty(_require);

var _require2 = require("./../controller/userController"),
    createUser = _require2.createUser,
    getAllUsers = _require2.getAllUsers,
    updateUser = _require2.updateUser,
    deleteUser = _require2.deleteUser,
    getUserById = _require2.getUserById,
    uploadUserImage = _require2.uploadUserImage,
    resizeUserImage = _require2.resizeUserImage,
    updateMe = _require2.updateMe,
    updatePassword = _require2.updatePassword;

var _require3 = require("./../utils/validatorRules/userValidator"),
    getUserValidatorById = _require3.getUserValidatorById,
    createUserValidator = _require3.createUserValidator,
    updateUserValidator = _require3.updateUserValidator,
    deleteUserValidatorById = _require3.deleteUserValidatorById,
    changeUserPasswordValidator = _require3.changeUserPasswordValidator;

var _require4 = require("./../utils/validatorRules/authValidator"),
    signUpUserValidator = _require4.signUpUserValidator,
    loginUserValidator = _require4.loginUserValidator;

router.post("/sign-up", signUpUserValidator, auth.sign_up);
router.post("/login", loginUserValidator, auth.login);
router.route("/").post(uploadUserImage, resizeUserImage, createUserValidator, createUser).get(getAllUsers);
router.route("/update-password/:id").patch(changeUserPasswordValidator, updatePassword);
router.route("/:id").get(getUserById).patch(uploadUserImage, resizeUserImage, updateUserValidator, updateMe)["delete"](deleteUser);
module.exports = router;