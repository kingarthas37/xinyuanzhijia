'use strict';

let env = process.env.NODE_ENV || 'development';
let assetName = require('../package').name;

module.exports = {
    data:{
        title: '51wish.cn',
        name:'心愿之家',
        titleAdmin:'51wish.cn后台管理',
        currentPage: 'index',
        info:{success:null,error:null},
        user:null,
        env:env,
        asset: env === 'development' ? 'dist' : 'min',
        assetName:assetName
    },
    page:{
        limit:20
    },
    env: env || 'development'
};