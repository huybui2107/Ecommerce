const express = require('express');
const {default :helmet} = require('helmet'); 
const compression = require('compression');
const app = express();
require('dotenv').config()
const morgan = require('morgan');

//init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

//init db


// init routes
app.get('/test',(req, res, next) =>{
    return res.status(200).json({
        message : 'Success'
    })
})

module.exports = app;