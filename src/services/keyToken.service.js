'use strict';

const keytokenModel = require("../models/keytoken.model");
const { Types } = require('mongoose');
class KeyTokenService {
    static createKeyToken = async ({userId , publicKey, privateKey,refreshToken}) =>{
        try {
            //lv0
            // const publicKeyString = publicKey.toString();
            // const tokens = await keytokenModel.create({
            //     user :userId,
            //     publicKey,
            //     privateKey
            // })
            // return tokens ? tokens.publicKey : null;

            // 
            // lv1
            const filter = {user: userId} 
            const  update = {publicKey , privateKey, refreshTokensUsed : [], refreshToken}
            const options = { upsert: true, new: true };
            const tokens = await keytokenModel.findOneAndUpdate(filter,update, options)
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error.message
        }
    }

    static findByUserId = async (userId) => {
        return await keytokenModel.findOne({user :userId}).lean();
        
    }
    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne({
            _id : id
        });
    }
    static findByRefreshTokenUsed = async (refreshToken) => {
         return await keytokenModel.findOne( {
                refreshTokensUsed : refreshToken
         }).lean()
    }
    static findByRefreshToken = async (refreshToken) => {
        return await keytokenModel.findOne( {refreshToken}).lean()
   }
    static removeKeyByuserId = async (id) => {
        return await keytokenModel.deleteOne({
            user:id
        });
    }
    static updateKey = async (tokens,refreshToken,keyStore) =>{
        return await keytokenModel.findByIdAndUpdate(keyStore._id,
            {
                $set :{
                    refreshToken : tokens.refreshToken
                },
                $addToSet : {
                    refreshTokensUsed : refreshToken
                }
            }
        )
    }
}

module.exports = KeyTokenService;