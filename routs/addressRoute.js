const express = require('express');

const auth = require('../controller/authController');

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require('../controller/addressController');

const router = express.Router();

router.use(auth.protect, auth.allowedTo('user'));

router.route('/').post(addAddress).get(getLoggedUserAddresses);

router.delete('/:addressId', removeAddress);

module.exports = router;
