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
    website: {
        domain: 'http://www.51wish.cn',
        cookieDomain : '.51wish.cn'
    },
    data: {
        title: '心愿之家-',
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
        x_lc_sign:x_lc_sign,
        onsale:null,
        productMethodId:null
    },
    page: {
        limit: 20
    },
    env:env,
    errors:{
        UNAUTHORIZED:'未经授权的访问'
    },
    watermark:{
        main:'?watermark/1/image/aHR0cDovL2FjLUpvYUJjUlR0LmNsb3VkZG4uY29tLzEyZTA5Zjg2MzRjNWI2ODlmMzYyLnBuZw==/dissolve/100/gravity/SouthEast/dx/0/dy/50'
    },
    wechatConfig: {
        expiresAt:'7100',
        appId: 'wx4fdd66942d6ecb22',
        appSecret: '228e7bc9300730dbfb5e1f4c5ee65db3'
    },
    wechatApi: {
        'authorize': 'https://open.weixin.qq.com/connect/oauth2/authorize?appid={appid}&redirect_uri={redirectUrl}&response_type=code&scope={scopt}&state={state}#wechat_redirect',             //微信网页授权第一步(用户同意授权，获取code)
        'authorizeAccessToken': 'https://api.weixin.qq.com/sns/oauth2/access_token?appid={appid}&secret={secret}&code={code}&grant_type=authorization_code',  //微信网页授权第二步(通过code换取网页授权access_token)
        'authorizeRefreshToken': 'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid={appid}&grant_type=refresh_token&refresh_token={refreshToken}',      //微信网页授权第三步(刷新access_token)
        'authorizeUserinfo': 'https://api.weixin.qq.com/sns/userinfo?access_token={accessToken}&openid={openid}&lang=zh_CN',                 //微信网页授权第四步(拉取用户信息(需scope为 snsapi_userinfo))
        'userinfo': 'https://api.weixin.qq.com/cgi-bin/user/info',                      //通过oppenid获得用户信息(已关注)
    },
    areaNumber: {   //国家地区编号
        1:'美国',
        86:'中国',
        81:'日本',
        61:'澳大利亚'
    },
    productType: {
        normal:'product',
        all:'productAll'
    },
    aliExpress: {
        appCode: 'APPCODE ac9f29a3f62e4d31befb3e03881ae3f4'
    }
};