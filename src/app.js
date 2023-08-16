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
app.use(express.urlencoded({ extended :true}));
app.use(express.json());

//init db
require('./dbs/init.mongodb');
const { checkOverload } = require('./helpers/check.connect');
// checkOverload();
// init routes
app.use('/',require('./routes'));


// handling Error 
app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next)=>{
    const statusCode = error.status || 500 ;
   return res.status(statusCode).json({
        status: 'error',
        code  :statusCode,
        stack : error.stack,
        message : error.message || 'Internal Server Error'
   })
})

module.exports = app;