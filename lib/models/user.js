'use strict';
let tableName = 'User';
let base = require('../../lib/models/base');
let user, av, extend, config;

module.exports = {
    init() {
        extend = base.getExtend();
        user = base.getObject(tableName);
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
    singIn(mobile, smsCode){
        return new Promise(function(resolve, reject) {
            av.User.signUpOrlogInWithMobilePhone(mobile, smsCode).then(function(success) {
                resolve(success);
            }, function(error) {
                resolve(error);
            });
        });
    },
    singInWithWechat(openid, access_token){
        return new Promise(function(resolve, reject) {
              av.User.signUpOrlogInWithAuthData({
                "openid": openid,
                "access_token": access_token,
                "expires_at": config.wechatConfig.expiresAt
            }, 'weixin').then(function (success) {
                resolve(success);
            }, function (error) {
                resolve(error);
            });
        });
    },
    requestSmsCode(mobile){
        return new Promise(function(resolve, reject) {
            av.Cloud.requestSmsCode(mobile).then(function (success) {
                resolve(success);
            }, function (error) {
                resolve(error);
            });
            
        });
    }
   
};