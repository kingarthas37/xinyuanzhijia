'use strict';

let env = process.env.LEANCLOUD_APP_ENV || 'development';
let assetName = require('../package').name;
let md5 = require('md5');

//应用Keys,请求header设置
let keys = {
    AppId: 'QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz',
    AppKey: 'Wwh9RRHIySPlvToe3dsIVfS7',
    MasterKey: 'mCIsLsrtOgujruzfcEGDm9Uh'
};

let timestamp = new Date().getTime();
let X_LC_Id = keys.AppId;
let X_LC_Sign = `${md5(timestamp + keys.AppKey)}`;

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
        x_lc_id:X_LC_Id,
        x_lc_sign:X_LC_Sign
    },
    page: {
        limit: 20
    },
    env:env
};