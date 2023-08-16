const { CREATED , SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.strategy");
class ProductController {
        createProduct = async (req, res ,next) => {
            new SuccessResponse({
                 message :'Create new Product successfully',
                 metadata : await ProductServiceV2.createProduct(
                        req.body.product_type, {
                            ...req.body,
                            product_shop : req.user.userId
                        }
                        )
            }).send(res);
        }

        updateProduct = async (req, res ,next) => {
            new SuccessResponse({
                 message :'update Product successfully',
                 metadata : await ProductServiceV2.updateProduct(
                    req.body.product_type,
                    req.params.productId,
                    {
                    ...req.body,
                    product_shop:req.user.userId
                 })
            }).send(res);
        }

        /**
         * @description Get all Draft for shop
         * @param {Number}  skip
         * @param {Number}  limit
         * @return {JSON} 
         */
        getAllDraftsForShop = async (req, res , next) => {
            new SuccessResponse({
                message :'Get list draft success',
                metadata : await ProductServiceV2.findAllDrafForShop({
                           product_shop : req.user.userId
                       })
           }).send(res);
        }

        getAllPublicsForShop = async (req, res , next) => {
            new SuccessResponse({
                message :'Get list public success',
                metadata : await ProductServiceV2.findAllPublicForShop({
                           product_shop : req.user.userId
                       })
           }).send(res);
        }

        PublishProductByShop = async (req, res ,next) => {
            new SuccessResponse({
                 message :'public Product successfully',
                 metadata : await ProductServiceV2.publicProductByShop(
                         {
                             product_id : req.params.id ,
                             product_shop : req.user.userId
                        })
            }).send(res);
        }

        unPublishProductByShop = async (req, res ,next) => {
            new SuccessResponse({
                 message :'unpublic Product successfully',
                 metadata : await ProductServiceV2.unPublicProductByShop(
                         {
                             product_id : req.params.id ,
                             product_shop : req.user.userId
                        })
            }).send(res);
        }

        searchProduct = async (req, res, next) => {
       
            new SuccessResponse({
              message: "search product success",
              metadata: await ProductServiceV2.searchProduct(req.params),
            }).send(res);
          };

        findAllProduct = async (req, res, next) => {
       
            new SuccessResponse({
              message: "Find all product success",
              metadata: await ProductServiceV2.findAllProduct(req.query),
            }).send(res);
        };

        findProduct = async (req, res, next) => {
       
            new SuccessResponse({
              message: "Find one product success",
              metadata: await ProductServiceV2.findProduct({
                product_id: req.params.id
              }),
            }).send(res);
        };
}

module.exports = new ProductController ;