'use strict';

const ShopModel = require("../models/Shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const RoleShop ={
    SHOP :'SHOP',
    WRITER :'WRITER',
    EDITOR :'EDITOR',
    ADMIN :'ADMIN',
}
class AccessService {
    static signUp = async ({name,email,password}) =>{
         try {
            const hodelShop = await ShopModel.findOne({email}).lean(); // lean giup query nhanh hon giam tai size object
            if(hodelShop){
                return {
                    code: 'xxx',
                    massage: 'Shop already rigister'
                }
            }
            const hashPassword = await bcrypt.hash(password,12);
            const newShop = await ShopModel.create(
                {   name,
                    email,
                    password : hashPassword , 
                    roles :[RoleShop.SHOP]
                });
            if(newShop){
                // create privateKey , publicKey V1(kho)
               // const {privateKey , publicKey} =crypto.generateKeyPairSync('rsa',{
                //     modulusLength: 4096,
                //     publicKeyEncoding :{
                //         type : 'pkcs1',
                //         format : 'pem'
                //     },
                //     privateKeyEncoding :{
                //         type : 'pkcs1',
                //         format : 'pem'
                //     }
                // })
                // create privateKey , publicKey V2(don gian hon)
                const privateKey = crypto.randomBytes(64).toString("hex");
                const publicKey = crypto.randomBytes(64).toString("hex");
                console.log({privateKey ,publicKey}); //save collection KeyStore

                const keyStore = await KeyTokenService.createKeyToken({
                     userId : newShop._id,
                     publicKey,
                     privateKey
                })
                if(!keyStore) {
                    return {
                        code: 'xxx',
                        massage: 'publicKeyString error',
                    }
                }
                // console.log(`publicKeyString::`,publicKeyString);
                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                // create token pair 
                const tokens =await createTokenPair({userId : newShop._id,email},publicKey,privateKey);
                console.log(`create token Successfully`,tokens);
                return {
                    code: '201',
                    metadata :{
                        shop : getInfoData({ fileds:['_id','name','email'], object : newShop}),
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata :null
            }
         } catch (error) {
             return {
                code :'xxx',
                message : error.message,
                status :'error',
             }
         }
    }
}


module.exports =AccessService;