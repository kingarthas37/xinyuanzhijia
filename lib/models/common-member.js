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
    singIn(mobile, smsCode){
        var _this = this;
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
                            console.log(error);
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
                            console.log(error);
                            reject(error);
                        });
                    } 
                });
            }
        });
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
    getMemberByObjectId(req, res) {
        let objectId = req.cookies.sessionId;
        if (objectId && typeof(objectId) != "undefined") {
            let query = new av.Query(commonMember);
            query.equalTo('objectId', objectId);
            return new Promise(function (resolve, reject) {
                query.first().then(data => {
                    req.session.member = {'username': data.attributes.username, 'id' : data.attributes.commonMemberId, 'objectId' : data.id, 'nickname' : data.attributes.nickname};
                    resolve(data);
                });
             });
        }
    }
};