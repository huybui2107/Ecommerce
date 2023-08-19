const { CREATED , SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res ,next) => {
        new SuccessResponse({
             message :'Create new Cart successfully',
             metadata : await CartService.addToCart(req.body)
        }).send(res);
    }


    //update inc or dec quantity
    update = async (req, res ,next) => {
        new SuccessResponse({
             message :'Update Cart successfully',
             metadata : await CartService.addToCartV2(req.body)
        }).send(res);
    }


    delete = async (req, res ,next) => {
        new SuccessResponse({
             message :'delete Cart successfully',
             metadata : await CartService.deleteItemInCart(req.body)
        }).send(res);
    }

    listToCart = async (req, res ,next) => {
        console.log(`TST` ,req.query)
        new SuccessResponse({
             message :'Get list Cart successfully',
             metadata : await CartService.getListUserCart(req.query)
        }).send(res);
    }
}


module.exports = new CartController();
