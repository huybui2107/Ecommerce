'use strict';

const { findCartById } = require("../models/repositories/cart.repo");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const { order } = require("../models/order.model");
/** 
   Payload 
   {
    cartId,
    userId,
    shop_order_ids :[
        {
            shopId,
            shop_discount :[
                {
                    shopId,
                    discountId
                    codeId
                }
            ],
            item_products : [
                {
                    price,
                    quantity,
                    productId
                }
            ]
        }
    ]
   }
 */
class CheckoutService {
    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        // check cartId ton tai khong ?
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new BadRequestError('Cart does not exist !');

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }
        const shop_order_ids_new = []
        // tinh tong tien bill 
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];
            // check product available 

            const checkProductServer = await checkProductByServer(item_products);
            console.log(`checkProductServer: ${checkProductServer[0]}`)
            if (!checkProductServer[0]) throw new BadRequestError(`order wrong`);

            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0)

            // tong tien trc khi xu ly
            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice, // tien trc khi giam gia
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // new shop_discount ton tai > 0 thi check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co mot discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                console.log(`TEST 1: ${discount}`)
                // tong cong discount giam gia
                checkout_order.totalDiscount += discount
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            //tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }


    // order 
    static async orderByUser({ shop_order_ids, cartId, userId, user_address = {}, user_payment = {} }) {

        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })


        //  check lai 1 lan nua xem vuot ton kho hay khong ?
        // get new arr product 
        const products = shop_order_ids_new.flatMap(order => order.item_products);
        console.log(`[1] :`, products);
        const acquireProduct = []
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false);
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check if co 1 san pham het hang trong kho ?
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so san pham da dc cap nhat , vui long quay lai gio hang')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids

        });
        return newOrder;
    }
}

module.exports = CheckoutService;