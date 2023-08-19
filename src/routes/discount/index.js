'use strict';
const express = require('express');
const router = express.Router();
const DiscountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationv2 } = require('../../auth/authUtils');

// get ammount a discount
router.post('/amount', asyncHandler(DiscountController.getAllDiscountAmount))
router.get('/list_product_code', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))


router.use(authenticationv2)

router.post('', asyncHandler(DiscountController.createDiscountCode));
router.get('', asyncHandler(DiscountController.getAllDiscountCodes));


module.exports = router