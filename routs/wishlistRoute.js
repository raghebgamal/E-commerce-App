const express = require('express');

const auth = require('../controller/authController');

const {
  addProductToWishlist,
  removeProductFromWishlist,
  getLoggedUserWishlist,
} = require('../controller/wishlistController');

const router = express.Router();

router.use(auth.protect, auth.allowedTo('user'));

router.route('/').post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete('/:productId', removeProductFromWishlist);

module.exports = router;
