'use strict';

const redis = require('redis');
const { promisify }  = require('util');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setnx).bind(redisClient);

const acquireLock = async (productId , quantity , cartId) =>{
     const key = `lock_v2023_${productId}`;
     const retryTimes = 10 ;
     const expireTime = 3000 ; // 3 seconds time lock

     for (let i = 0 ; i < retryTimes ; i++) {
         // tao mot key , thang nao nam giu dc vao thanh toan
         const result = await setnxAsync(key , expiryTime);
         console.log(`result: ${result}`);
         if (result === 1) {
             // thao tac voi inventory
            const isReservation = await reservationInventory({
                productId,quantity,cartId
            })
            if(isReservation.modifiedCount){
                await pexpire(key, expiryTime)
                return key
            }
             return null;
         }
         else {
            await new Promise((resolve, reject) =>setTimeout(resolve, 50));
         }
     }
}

const releaseLock = async keyLock =>{
     const delAsyncKey = promisify(redisClient.del).bind(redisClient);
     return delAsyncKey(keyLock);
}

module.exports = {
    acquireLock ,
    releaseLock
}