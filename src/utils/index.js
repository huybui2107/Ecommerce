'use strict';

const _ = require('lodash');
const getInfoData = ( {fileds =[] , object = {}}) =>{
        return _.pick(object, fileds)
}

// ['a' , 'b'] => { a : 1 , b : 1}
const getSelectData =( select = [] ) =>{
    return Object.fromEntries(select.map( el => [el ,1]));
}
const getUnSelectData =( select = [] ) =>{
    return Object.fromEntries(select.map( el => [el ,0]));
}

const removeUnderfinedObject = obj =>{
    Object.keys(obj).forEach( k =>{
        if(obj[k] == null) {
            delete obj[k];
        }
    })
    return obj;
}

const updateNestedObjectParser = object  =>{
    const final = {}
    // console.log(`1 ::`,object)
    Object.keys(object || {}).forEach( k =>{
        if( typeof object[k] === 'object' && !Array.isArray(object[k]) ) {
            const reponse = updateNestedObjectParser(object[k])
            Object.keys(reponse || {}).forEach( a =>{
                 final[`${k}.${a}`] = reponse[a]
            })
        }else{
            final[k] = object[k];
        }
    })
    // console.log(`2 ::`,final)
    return final
}
module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUnderfinedObject,
    updateNestedObjectParser
}