 /**
        Discount Service
        1- Generator discount code [shop / admin]
        2- Get all discount codes [user /shop]
        3-Get all product by discount code [User]
        4-Get discount ammount [user]
        5- delete discount code [admin /shop]
        6- Cancel discount code [user]
  */

const { BadRequestError, NotFoundError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { product } = require("../models/product.model")
const { findAllDiscountCodesUnselect, checkDiscountExists } = require("../models/repositories/discount.repo")
const { findAllProduct } = require("../models/repositories/product.repo")


class DiscountService {
    static async createDiscountCode(payload){
        const { code,start_date,end_date, is_active, shopId, min_order_value, 
               product_ids, applies_to, name, description, type , value, 
               max_uses ,uses_count ,max_uses_per_user,users_used
            } = payload 

        // check data
        
        if( new Date() > new Date(start_date) || new Date() > new Date(end_date)){
            throw new BadRequestError('Discount code has expried !')
        }

        // create index for discount code 
        const foundDiscount = await discountModel.findOne({
            discount_code : code,
            discount_shopId : shopId
        }).lean()

        if(foundDiscount) throw new BadRequestError('Discount exists !')
        const newDiscount = await discountModel.create({
            discount_name :name,
           discount_description :description,
           discount_type :type,
           discount_value :value,
           discount_code :code,
           discount_start_date :new Date(start_date),
           discount_end_date :new Date(end_date),
           discount_max_uses :max_uses, 
           discount_uses_count :uses_count, 
           discount_users_used :users_used, 
           discount_max_uses_per_user :max_uses_per_user, 
           discount_min_order_value :min_order_value || 0, 
           discount_shopId :shopId, 
           
           discount_is_active :is_active, 
           discount_applies_to :applies_to,
           discount_product_ids :applies_to === 'all' ? [] : product_ids 
        })

        return newDiscount;
    }

    static async updateDiscount() {

    }

    //  Get all discount codes available with products
    static async getAllDiscountCodesWithProduct({code, shopId, userId , limit , page})
    {
        const foundDiscount = await discountModel.findOne({
            discount_code : code,
            discount_shopId : shopId
        }).lean()

        if(!foundDiscount || !foundDiscount.discount_is_active){
             throw new NotFoundError('discount exists !')
        }
        const {discount_applies_to, discount_product_ids} = foundDiscount
        let products ;
        if(discount_applies_to === 'all'){
            // get all product
          products = await findAllProduct({
                filter :{
                    product_shop : shopId,
                    isPublic : true
                },
                limit : +limit,
                page : +page,
                sort:'ctime',
                select: ['product_name']
            })
        }
        if(discount_applies_to === 'specific'){

            products = await findAllProduct({
                filter :{
                    _id : {
                        $in : discount_product_ids
                    },
                    isPublic : true
                },
                limit : +limit,
                page : +page,
                sort:'ctime',
                select: ['product_name']
            })
        }
        console.log(`TEST 1 ::` ,products);
        return products ;
    }
    static async getAllDiscountCodesByShop({limit,page,shopId}) {
      
        const discounts = await findAllDiscountCodesUnselect({
            limit : limit,
            page : page,
            filter :{
                discount_shopId : shopId,
                discount_is_active : true
            },
            unselect : ['__v', 'discount_shopId'],
            model : discountModel
        })
        
        return discounts ;
    }
    //  Get discount_code amount 
    /*
        Apply discount code
        products  = {
              productId,
              shopId,
              quantity,
              name,
              price,

            }
     */

    static async getDiscountAmmount ({codeId, userId , shopId, products}) {
        console.log(`TEST 1`,codeId)
        console.log(`TEST 1`,userId)
        console.log(`TEST 1`,shopId)
        console.log(`TEST 1`,products)
        const foundDiscount = await checkDiscountExists({
            model: discountModel, 
            filter :{
                discount_shopId : shopId,
                discount_code : codeId,
            }})
        if(!foundDiscount) throw new NotFoundError(`discount doesn't exist 1`);
        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
            discount_min_order_value
        } = foundDiscount;
        if(!discount_is_active) throw new NotFoundError('discount expried');
        if(!discount_max_uses) throw new NotFoundError('discount are out');

        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
        //     throw new NotFoundError(`discount ecode has expried !`)
        // }

        // check xem co set gia tri toi thieu hay ko
        let totalOrder = 0
        if(discount_min_order_value > 0) {
            // getTotal
            totalOrder = products.reduce((acc,product)=>{
                return acc  + (product.quantity * product.price)
            },0)

            if (totalOrder < discount_min_order_value){
                throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}`)
            }
        }

        if(discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId === userId)
            if(userUserDiscount) {
                //....
            }
        }

        // check xem discount nay la fixed_amount 
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder *(discount_value /100)
        return {
            totalOrder,
            discount : amount,
            totalPrice : totalOrder - amount,
        }
    }

    static async deleteDiscountCode({shopId, codeId}){
        const deleted = await discountModel.findOneAndDelete({
                discount_code : codeId,
                discount_shopId : shopId,
        })
        return deleted ;
    }

    static async cancelDiscountCode({shopId, codeId,userId }){
        const foundDiscount = await checkDiscountExists({
            model: discountModel, 
            filter :{
                discount_shopId : shopId,
                discount_code : codeId,
            }})
            if(!foundDiscount) throw new NotFoundError(`discount doesn't exist`);
            const result  = await discountModel.findByIdAndUpdate(foundDiscount._id,{
                $pull :{
                    discount_users_used : userId
                },
                $inc : {
                    discount_max_uses : 1,
                    discount_uses_count :-1
                }
            })

            return result;
    }
}

module.exports = DiscountService;