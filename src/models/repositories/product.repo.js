'use strict';


const { product ,electronic ,clothing ,furniture} = require('../../models/product.model'); 
const { getUnSelectData } = require('../../utils');


const findAllDrafForShop = async ({query, limit,skip}) =>{
    return await product.find(query)
        .populate('product_shop','name email -_id')
        .sort({updateAt :-1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()



}

const findAllPublicForShop = async ({query, limit,skip}) =>{
    return await product.find(query)
        .populate('product_shop','name email -_id')
        .sort({updateAt :-1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()

}

const findAllProduct = async ({limit, sort, page , filter , select}) =>{
    const skip = (page - 1) * limit ;
    const sortBy = sort === 'ctime' ? {_id :-1} : {_id : 1}
    const products = await product.find( filter)
                                      .sort(sortBy)
                                      .skip(skip)
                                      .limit(limit)
                                      .select(select)
                                      .lean()
    return products ;
}
const publicProductByShop = async ({product_shop , product_id}) =>{
     const foundShop = await product.findOne({
        product_shop : product_shop,
        _id : product_id
     })
     if(!foundShop ) return null;
     foundShop.isDraft = false;
     foundShop.isPublic = true;
     const {modifiedCount} = await foundShop.updateOne(foundShop);
     return modifiedCount
}

const unPpublicProductByShop = async ({product_shop , product_id}) =>{
    const foundShop = await product.findOne({
       product_shop : product_shop,
       _id : product_id
    })
    if(!foundShop ) return null;
    foundShop.isDraft = true;
    foundShop.isPublic = false;
    const {modifiedCount} = await foundShop.updateOne(foundShop);
    return modifiedCount
}
const searchProductByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await product
      .find(
        {
          isPublic: true,
          $text: {
            $search: regexSearch,
          },
        },
        { score: { $meta: "textScore" } }
      )
      .sort({ score: { $meta: "textScore" } })
      .lean();
    console.log(results);
    return results;
  };

  const findProduct = async ({product_id , unSelect}) =>{
      return await product.findOne({
        _id : product_id
      }).select(getUnSelectData(unSelect)).lean();
  }
  const updateProductById = async ({product_id ,objectParams, model,isNew =true}) =>{
     return await model.findByIdAndUpdate(product_id ,objectParams ,{
      new : isNew
     })
   }

   const getProductById = async (productId) =>{
     return await product.findOne({
      _id :productId
     })
   }
module.exports = {
    findAllDrafForShop,
    publicProductByShop,
    findAllPublicForShop,
    unPpublicProductByShop,
    searchProductByUser,
    findAllProduct,
    findProduct,
    updateProductById,
    getProductById
}