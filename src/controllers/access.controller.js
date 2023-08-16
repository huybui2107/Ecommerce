'use strict';

const { CREATED , SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {

    signup = async (req, res,next) => {
       
            // return res.status(201).json(await AccessService.signUp(req.body));
            new CREATED({
                message :'Regiserted Ok!',
                metadata : await AccessService.signUp(req.body),
                options : {
                    limit : 10,
                }
            }).send(res);
    }

    login = async (req, res, next) => {
        // console.log(req.body);
        new SuccessResponse ({
            metadata : await AccessService.login(req.body)
        }).send(res);
    }
    logout = async (req, res, next) => {
        new SuccessResponse ({
            massage :'Logout success',
            metadata : await AccessService.logout(req.keyStore)
        }).send(res);
    }

    handleRefreshToken = async (req, res ,next) => {
        //v1
        // new SuccessResponse ({
        //     massage :'Get token success',
        //     metadata : await AccessService.handleRefreshToken(req.body.refreshToken)
        // }).send(res);

        //v2
        console.log(`check 1 ::`,req.refreshToken);
        console.log(`check 2::`,req.user);
        console.log(`check 3::`,req.keyStore);
        new SuccessResponse ({
            massage :'Get token success',
            metadata : await AccessService.handleRefreshTokenV2({
                refreshToken : req.refreshToken,
                user : req.user,
                keyStore : req.keyStore
            })
        }).send(res);

    }
}

module.exports = new AccessController();