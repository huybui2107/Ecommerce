'use strict';

const ShopModel = require("../models/Shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError , ConflictRequestError, AuthFailureError, ForbiddenError} = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { chain, thru } = require("lodash");
const { token } = require("morgan");
const RoleShop ={
    SHOP :'SHOP',
    WRITER :'WRITER',
    EDITOR :'EDITOR',
    ADMIN :'ADMIN',
}
class AccessService {
    static handleRefreshTokenV2 = async ({ refreshToken, keyStore, user }) => {
        const { userID, email } = user;
        console.log(`check ::`,keyStore.refreshTokensUsed);
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
          await KeyTokenService.removeKeyByuserId(userID);
          throw new ForbiddenError("Some thing wrong happened. Please re-login");
        }
    
        if (keyStore.refreshToken !== refreshToken)
          throw new AuthFailureError("Shop not registered");
    
        const foundShop = await findByEmail({ email });
        if (!foundShop) throw new AuthFailureError("Shop not registered");
        //Create token moi
        const tokens = await createTokenPair(
          {
            userID,
            email,
          },
          keyStore.publicKey,
          keyStore.privateKey
        );
    
        //update token
            await KeyTokenService.updateKey(tokens,refreshToken,keyStore);
            return {
                user,
                tokens,
              };
        
      };
    // checktoken used ?
    static handleRefreshToken = async (refreshToken) => {
        // check xem RT da duoc su dung chua neu co thi xoa ngay
            const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
            if(foundToken){
                const { userId , email} = await verifyJWT(refreshToken, foundToken.privateKey);
                console.log(`Error` ,{ userId, email });
             
                // xoa
                await KeyTokenService.removeKeyByuserId(userId);
                throw new ForbiddenError('Someone try to access!!')
            }
            const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
            if(!holderToken) throw new AuthFailureError('Shop no registered')
            const { userId , email} = await verifyJWT(refreshToken, holderToken.privateKey);
            console.log(`[2]--`, { userId, email });
            const foundShop = await findByEmail({email});
            if(!foundShop) throw new AuthFailureError('Shop not registered')

            const tokens =await createTokenPair({userId : foundShop._id,email},holderToken.publicKey,holderToken.privateKey);

            // update token 
            console.log(`[3]--`, holderToken);
            holderToken.refreshToken = tokens.refreshToken ;
            holderToken.refreshTokensUsed.push(tokens.refreshToken);
            await KeyTokenService.updateKey(holderToken,refreshToken);
            return {
                user: { userId, email },
                tokens,
              };
    }
    static logout = async (keyStore) =>{
        const delKey = await KeyTokenService.removeKeyById(keyStore._id);
        console.log({delKey});
        return delKey;
    }
    static login = async ({email, password , refreshToken = null}) => {
         /*
         1 -Check email
         2 - match password
         3- create AT and RT and save
         4- get data return login 
         */
        console.log(email);
        const foundShop = await findByEmail({email});
        if(!foundShop) throw new BadRequestError(`Shop not registered `);

        const match = bcrypt.compare(password, foundShop.password);
        if(!match) throw new AuthFailureError(`Authentication error `);

        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const tokens =await createTokenPair({userId : foundShop._id,email},publicKey,privateKey);

        const keyStore = await KeyTokenService.createKeyToken({
            userId : foundShop._id,
            publicKey,
            privateKey,
            refreshToken : tokens.refreshToken
       })
        
        console.log(keyStore);

        return {
                shop : getInfoData({ fileds:['_id','name','email'], object : foundShop}),
                tokens
        }
    }
    static signUp = async ({name,email,password}) =>{
        //  try {
            const hodelShop = await ShopModel.findOne({email}).lean(); // lean giup query nhanh hon giam tai size object
            if(hodelShop){
                // return {
                //     code: 'xxx',
                //     massage: 'Shop already rigister'
                // }
                throw new BadRequestError('Error: Shop already rigister!')
            }
            const hashPassword = await bcrypt.hash(password,12);
            const newShop = await ShopModel.create(
                {   name,
                    email,
                    password : hashPassword , 
                    roles :[RoleShop.SHOP]
                });
            if(newShop){
                // create privateKey , publicKey V1(RSA)
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

                        shop : getInfoData({ fileds:['_id','name','email'], object : newShop}),
                        tokens
                    
                }
            }
            return {
                code: '200',
                metadata :'Hy'
            }
        //  } catch (error) {
        //      return {
        //         code :'xxx',
        //         message : error.message,
        //         status :'error',
        //      }
        //  }
    }
}


module.exports =AccessService;