'use strict';


const jwt = require("jsonwebtoken");
const asyncHandler = require('../helpers/asyncHandler')
const { AuthFailureError ,NotFoundError } = require('../core/error.response');
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};
// public key de verify token
// private key 
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await jwt.sign(payload,publicKey,{
        // algorithm :'RS256',
        expiresIn : '2 days',
    })
    // refresh token
    const refreshToken = await jwt.sign(payload,privateKey,{
        // algorithm :'RS256',
        expiresIn : '7 days',
    })

    ///
    // jwt.verify(accessToken, publicKey ,(err ,decode)=>{
    //      if (err) { console.log(`error verify::`,err);  }
    //      else { console.log(`decode verify::`,decode) }
    // })

    return {accessToken , refreshToken}
  } catch (error) {
    
  }
}
const authentication = asyncHandler( async (req,res,next) =>{
    /**
     *  1 - Check userId missing ???
     *  2 - get access token
     * 3 - verifyToken
     *  4 - check user in bds
     * 5 - check keyStore with userId
     * 6 - Ok all => return next
     */
    const userId = req.headers[HEADER.CLIENT_ID]
    if(!userId) throw new AuthFailureError('Invalid Request');

    const  keyStore = await findByUserId(userId);
    if(!keyStore) throw new NotFoundError('Not Found Key');
    
    const  accessToken = req.headers[HEADER.AUTHORIZATION]
    if(!accessToken) throw new AuthFailureError('Invalid Request');
    
    try {
     
      const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
      if (!decodeUser) throw new AuthFailureError('Invalid test');
      if( userId !== decodeUser.userId ) throw new AuthFailureError('Invalid User');
      
      req.keyStore = keyStore;
      return next();
    } catch (error) {
       throw error;
    }

})
const authenticationv2 = asyncHandler(async (req, res, next) => {
  const userID = req.headers[HEADER.CLIENT_ID];
  if (!userID) throw new AuthFailureError("Invalid request");
  const keyStore = await findByUserId(userID);
  if (!keyStore) throw new NotFoundError("Not found key store");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey);
      if (userID !== decodeUser.userId)
        throw new AuthFailureError("Invalid User ID");

      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!accessToken) throw new AuthFailureError("Invalid request");
  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey);
    if (userID !== decodeUser.userId)
      throw new AuthFailureError("Invalid User ID 2");

    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await jwt.verify(token, keySecret);
}
module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationv2
}