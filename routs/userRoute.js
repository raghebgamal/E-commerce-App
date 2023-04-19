const express = require("express");
const router = express.Router();
const auth=require("./../controller/authController")

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  uploadUserImage,
    resizeUserImage,
  updatePassword,
  getMe,
  deleteMe,
  updateMe,
  updateMyPassword
} = require("./../controller/userController");
const {
  createUserValidator,
  updateUserValidator,
  changeUserPasswordValidator,
  changeMyPasswordValidator,
  updateMeValidator
} = require("./../utils/validatorRules/userValidator");


router.use(auth.protect);


router.get("/getMe",getMe, getUserById);
router.delete("/deleteMe",deleteMe);
router.patch("/updateMe",updateMeValidator,updateMe, updateUser);
router.patch("/updateMyPassword",changeMyPasswordValidator,updateMyPassword);

router.use(auth.allowedTo("admin"));
router
  .route("/")
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser)
  .get( getAllUsers);

router
  .patch("/update-password/:id", changeUserPasswordValidator, updatePassword);

router
  .route("/:id")
  .get(getUserById)
  .patch(uploadUserImage,resizeUserImage,updateUserValidator,updateUser)
  .delete(deleteUser);

module.exports = router;
