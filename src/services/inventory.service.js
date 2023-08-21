'use strict';

const { inventory } = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repo');
const { BadRequestError, NotFoundError } = require("../core/error.response")



class InventoryService {
    static async addStockToInventory({stock, productId, shopId, location = '12 , Nguyen Tat Thanh , Da Nang'}){
        const product = await getProductById(productId);
        if(!product) throw new BadRequestError('The product does not exists!');

        const query = {
            inven_shopId :shopId,
            inven_productId :productId
        }
        const updateSet = {
            $inc : {
                inve_stock : stock
            },
            $set :{
                inven_location : location
            }
        }
        const options = {upsert : true , new : true}
        return await inventory.findOneAndUpdate(query, updateSet, options)
    }
}

module.exports = InventoryService;