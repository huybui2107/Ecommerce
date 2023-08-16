'use strict'

const ShopModel = require("../models/Shop.model")

const findByEmail = async ({email, select = {
    email : 1, password : 1, name : 1, status : 1 , roles : 1 }
}) =>{
     return await ShopModel.findOne({email}).select(select).lean();
}

module.exports = {
    findByEmail
}