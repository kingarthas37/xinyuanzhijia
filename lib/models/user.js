'use strict';
let tableName = 'User';
let base = require('../../lib/models/base');
let user, av, extend, config;

require('../../lib/utils');

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
                resolve(success);
            }, function (error) {
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
    },
    updateUserInfo(req,res) {
        let mobilePhoneNumber = req.body['mobile'] ? parseInt(req.body['mobile']) : null;
        let username = req.body['nickname'];
        let sex = req.body['sex'];
        let birthday = req.body['birthday'];
        let wechat = req.body['wechat'];
        if (sex == 'female') {
            sex = 2;
        } else if (sex == 'male') {
            sex = 1;
        }
        let user = req.currentUser;
        
        /*if (mobilePhoneNumber) {
            user.set('mobilePhoneNumber', mobilePhoneNumber);
        }*/
        if (username) {
            user.set('username', username);
        }
        if (sex) {
            user.set('sex', sex);
        }
        if (birthday) {
            user.set('birthday', new Date(birthday));
        }
        if (wechat) {
            user.set('wechat', wechat);
        }
        user.save().then(data => {
            res.send({
                success:1
            });
        },
        error => {
            res.send({
                success:0,
                error
            })
        });
    }
};