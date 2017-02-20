'use strict';
let tableName = 'CommonMember';
let base = require('../../lib/models/base');
let av, extend, config;
let md5 = require('md5');
require('../../lib/utils');

module.exports = {
    init() {
        extend = base.getExtend();
        av = base.getAV();
        config = base.getConfig();
    },
    getSelect(data){
        return data;
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    wechatBaseLogin(req, res){
        let wechatLoginUrl = config.wechatApi.authorize;
        let redirectUrl = config.website.domain + '/user/login/wechat-base-login';
        wechatLoginUrl = wechatLoginUrl.replace('{appid}', config.wechatConfig.appId).replace('{redirectUrl}', redirectUrl).replace('{scopt}', 'snsapi_base').replace('{state}', '51wish');
        res.redirect(wechatLoginUrl);
    }
};