'use strict';

let env = process.env.NODE_ENV || 'development';
let assetName = require('../package').name;

module.exports = {
    data:{
        title: '51wish',
        currentPage: 'index',
        info:{success:null,error:null},
        user:null,
        env:env,
        asset: env === 'development' ? 'dist' : 'min',
        assetName:assetName
    },
    error:{
        NOT_SUCCESS:'未登录'
    },
    page:{
        LIMIT:20
    },
    env: env || 'development'
};