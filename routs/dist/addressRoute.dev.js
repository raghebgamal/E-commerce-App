"use strict";

var express = require('express');

var auth = require('../controller/authController');

var _require = require('../controller/addressController'),
    addAddress = _require.addAddress,
    removeAddress = _require.removeAddress,
    getLoggedUserAddresses = _require.getLoggedUserAddresses;

var router = express.Router();
router.use(auth.protect, auth.allowedTo('user'));
router.route('/').post(addAddress).get(getLoggedUserAddresses);
router["delete"]('/:addressId', removeAddress);
module.exports = router;