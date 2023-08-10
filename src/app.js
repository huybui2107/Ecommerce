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

module.exports = app;