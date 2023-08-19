'use strict';

const { NotFoundError } = require("../core/error.response");
const {cart} = require("../models/cart.model");
const { createUserCart, updateUserCartQuantity } = require("../models/repositories/cart.repo");
const { getProductById } = require("../models/repositories/product.repo");

/*
  Features: Cart Service 
1-add product to Cart 
2- Reduce product quantity
3- Increase product quantity 
4- Get list to Cart
5 - Delete cart 
6 delete cart item
*/

class CartService {
        static async addToCart({userId , product = {}}){
            //check cart co ton tai hay chua ?
            console.log(`TEST 1`,userId)
            const { product_name , product_price } = await getProductById(product.productId);
            product.name = product_name ;
            product.price = product_price;
             const userCart = await cart.findOne({cart_userId : userId});
             if(!userCart){
                    //  create cart for User
                    console.log(`TEST 2`)
                    return await createUserCart({userId ,product})
             }

             // neu  co gio hang roi nhung chua co san pham?
             if(!userCart.cart_products.length){
                 userCart.cart_products = [product]
                 return await userCart.save()
             }
             // gio hang ton tai va co san pham nay thi update quantity
             return await updateUserCartQuantity({useId,product});
        }

        // update cart
        /**
          shop_oder_ids :[
            {
              shopId,
              item_products :[
                {
                  quantity ,
                  price,
                  shopId,
                  old_quantity,
                  productId

                }
            ],
            version
            }
          ]
         */

          static async addToCartV2({userId , shop_oder_ids}){
              const { productId , quantity , old_quantity} = shop_oder_ids[0]?.item_products[0]
              // check product

              const foundProduct = await getProductById(productId) ;
              if(!foundProduct)  throw new NotFoundError('Product not exist') 

              //compare
              if(foundProduct.product_shop.toString() !== shop_oder_ids[0]?.shopId)  {
                throw new NotFoundError('Product do not belong to the shop');
              }

              if(quantity === 0) {

              }

              return await updateUserCartQuantity({
                  userId,
                  product :{
                     productId ,
                     quantity : quantity - old_quantity
                  }
              })


              
          }

          static async deleteItemInCart ({userId ,productId}){ 
                const query = {cart_userId : userId, cart_state : 'active'}
                const updateSet = {
                  $pull : {
                      cart_products : {
                        productId 
                      }
                  }
                }

                const deleteCart = await cart.updateOne(query,updateSet)
                return deleteCart
          }

          static async getListUserCart ({userId}) {
            return await cart.findOne({
              cart_userId : userId
            }).lean()
          }
}

module.exports = CartService;