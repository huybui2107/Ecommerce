'use strict';
const express = require('express');
const router = express.Router();
const AccessController = require('../../controllers/access.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication , authenticationv2 } = require('../../auth/authUtils');
//singUp
router.post('/shop/signup',asyncHandler(AccessController.signup));
// login
router.post('/shop/login',asyncHandler(AccessController.login));


// authentication 
// router.use(authentication)
router.use(authenticationv2);

router.post('/shop/logout',asyncHandler(AccessController.logout));
router.post('/shop/handleRefreshToken',asyncHandler(AccessController.handleRefreshToken));
module.exports = router;