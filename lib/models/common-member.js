'use strict';
let tableName = 'CommonMember';
let base = require('../../lib/models/base');
let commonMember, av, extend, config;
let md5 = require('md5');
require('../../lib/utils');

module.exports = {
    init() {
        extend = base.getExtend();
        commonMember = base.getObject(tableName);
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
    singIn(mobile, smsCode){var _this = this;
        return new Promise(function(resolve, reject) {
            av.Cloud.verifySmsCode(smsCode, mobile).then(function(success) {
                resolve(_this.add(mobile, null, null));
            }, function(error) {
                resolve(error);
            });
        });
    },
    singInWithWechat(openid, access_token){
        return this.add(null, openid, access_token);
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
        this.edit(req).then(success => {
            res.send(success);
        }, error => {
            res.send(error);
        });
    },
    add(mobile, openid, access_token) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (openid) {
                _this.getMemberByOpenId(openid).then(items => {
                    if (items.length > 0) {
                        resolve(items);
                    } else {
                        let expiresIn = Date.parse(new Date()) / 1000 + 7100;
                        let member = new commonMember();
                        member.set('authData', {"openid":openid,"access_token":access_token,"expires_in":expiresIn});
                        member.set('mobile', mobile);
                        member.set('username', mobile);
                        member.set('password', md5('123456'));
                        member.set('openid', openid);
                        member.save().then(result => {
                            resolve(_this.getMemberByOpenId(openid));
                        }, error => {
                            reject(error);
                        });
                    } 
                });
            } else {
                _this.getMemberByUserName(mobile).then(items => {
                    if (items.length > 0) {
                        resolve(items);
                    } else {
                        let member = new commonMember();
                        member.set('mobile', mobile);
                        member.set('username', mobile);
                        member.set('password', md5(mobile));
                        member.set('mobilePhoneVerified', true);
                        member.save().then(result => {
                            resolve(_this.getMemberByUserName(mobile));
                        }, error => {
                            reject(error);
                        });
                    } 
                });
            }
        });
    },
    edit(req) {
      //  let mobile = req.body['mobile'] ? req.body['mobile'] : null;
        let nickname = req.body['nickname'];
        let sex = req.body['sex'];
        let birthday = req.body['birthday'];
        let wechat = req.body['wechat'];
        let memberId = req.body['member-id'];
        var _this = this;
        if (memberId) {
            return new Promise(function(resolve, reject) {
                _this.getMemberByMemberId(memberId).then(member => {
                    if (sex == 'female') {
                        sex = 2;
                    } else if (sex == 'male') {
                        sex = 1;
                    }
                    //if (mobile) {
                    //    member.set('mobile', mobile);
                    //    member.set('username', mobile);
                    //}
                    if (nickname) {
                        member.set('nickname', nickname);
                    }
                    if (sex) {
                        member.set('sex', sex);
                    }
                    if (birthday) {
                        member.set('birthday', new Date(birthday));
                    }
                    if (wechat) {
                        member.set('wechat', wechat);
                    }
                    member.save().then(data => {
                        resolve({success:1});
                    }, error => {
                        resolve({success:0,error});
                    });
                });
            });
        }

    },
    getMemberByUserName(username) {
        let query = new av.Query(commonMember);
        query.equalTo('username', username);
        query.limit(1);
        return new Promise(function (resolve, reject) {
            query.find().then(items=> {
                resolve(items);
            });
        });
    },
    getMemberByOpenId(openid) {
        let query = new av.Query(commonMember);
        query.equalTo('openid', openid);
        query.limit(1);
        return new Promise(function (resolve, reject) {
            query.find().then(items=> {
                resolve(items);
            });
        });
    },
    getMemberByMemberId(memberId) {
        memberId = parseInt(memberId);
        let query = new av.Query(commonMember);
        query.equalTo('commonMemberId', memberId);return new Promise(function (resolve, reject) {
            query.first().then(item=> {
                resolve(item);
            });
        });
    }
};