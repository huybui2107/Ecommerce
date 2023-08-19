const { CREATED , SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
        createDiscountCode = async (req, res ,next) => {
            new SuccessResponse({
                 message :'Create new DiscountCode successfully',
                 metadata : await DiscountService.createDiscountCode({
                    ...req.body,
                    shopId : req.user.userId
                 })
            }).send(res);
        }

        getAllDiscountCodes = async (req, res ,next) => {
            new SuccessResponse({
                 message :' Successfully  Code Found',
                 metadata : await DiscountService.getAllDiscountCodesByShop({
                    ...req.query,
                    shopId : req.user.userId
                 })
            }).send(res);
        }

        getAllDiscountAmount = async (req, res ,next) => {
            new SuccessResponse({
                 message :' Successfully  Code ammount Found',
                 metadata : await DiscountService.getDiscountAmmount({
                    ...req.body
                 })
            }).send(res);
        }

        getAllDiscountCodesWithProduct = async (req, res ,next) => {
            new SuccessResponse({
                 message :' Successfully  Code Found 1',
                 metadata : await DiscountService.getAllDiscountCodesWithProduct({
                    ...req.query
                 })
            }).send(res);
        }

        
}

module.exports = new DiscountController ;