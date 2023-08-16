'use strict';
const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationv2 } = require('../../auth/authUtils');



router.get('/search/:keySearch',asyncHandler(ProductController.searchProduct));
router.get('',asyncHandler(ProductController.findAllProduct));
router.get('/:id',asyncHandler(ProductController.findProduct));
// authentication 
router.use(authenticationv2)

//POST
router.post('',asyncHandler(ProductController.createProduct));
router.patch('/:productId',asyncHandler(ProductController.updateProduct));
router.post('/public/:id',asyncHandler(ProductController.PublishProductByShop));
router.post('/unpublic/:id',asyncHandler(ProductController.unPublishProductByShop));
// GET
router.get('/drafts/all',asyncHandler(ProductController.getAllDraftsForShop));
router.get('/public/all',asyncHandler(ProductController.getAllPublicsForShop));
module.exports = router;