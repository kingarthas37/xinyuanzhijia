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
        let expiresAt = Date.parse(new Date()) / 1000 + 7100;
        return new Promise(function(resolve, reject) {
              av.User.signUpOrlogInWithAuthData({
                "openid": openid,
                "access_token": access_token,
                "expires_at": expiresAt
            }, 'weixin').then(function (success) {
                  console.log('SUCCESS=====>');
                  console.log(success);
                resolve(success);
            }, function (error) {
                  console.log('ERROR=====>');
                  console.log(error);
                resolve(error);
            });
        });
    },
    requestSmsCode(mobile){
        return new Promise(function(resolve, reject) {
            av.Cloud.requestSmsCode(mobile).then(function(success) {
                resolve({
                    success:1
                });
            }, function (error) {
                resolve({
                    success:0,
                    error:error
                });
            });
            
        });
    }
   
};