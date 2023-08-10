'use strict';

const jwt = require("jsonwebtoken");

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
    jwt.verify(accessToken, publicKey ,(err ,decode)=>{
         if (err) { console.log(`error verify::`,err);  }
         else { console.log(`decode verify::`,decode) }
    })

    return {accessToken , refreshToken}
  } catch (error) {
    
  }
}

module.exports = {
    createTokenPair
}