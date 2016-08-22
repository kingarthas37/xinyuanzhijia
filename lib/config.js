'use strict';

let env = process.env.LEANCLOUD_APP_ENV || 'development';
let assetName = require('../package').name;
let md5 = require('md5');

//应用Keys,请求header设置
let keys = {
    APPID: 'QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz',
    APPKEY: 'Wwh9RRHIySPlvToe3dsIVfS7'
};

let timestamp = new Date().getTime();
let x_lc_id = keys.APPID;
let x_lc_sign = `${md5(timestamp + keys.APPKEY)},${timestamp}`;

module.exports = {
    data: {
        title: '51wish.cn',
        name: '心愿之家',
        titleAdmin: '51wish.cn后台管理',
        currentPage: 'index',
        currentTag: 'index',
        info: {success: null, error: null},
        user: null,
        env: env,
        asset: env === 'production' ? 'min' : 'dist',
        assetName: assetName,
        x_lc_id:x_lc_id,
        x_lc_sign:x_lc_sign
    },
    page: {
        limit: 20
    },
    env:env,
    errors:{
        UNAUTHORIZED:'未经授权的访问'
    },
    watermark:{
        main:'?watermark/1/image/aHR0cDovL2FjLUpvYUJjUlR0LmNsb3VkZG4uY29tLzgwNmJhYjI3NTgxNjBjOGEzNzg4LnBuZw==/dissolve/90/gravity/SouthEast/dx/0/dy/50'
    }
};