'use strict';
let tableName = 'User';
let base = require('../../lib/models/base');
let user, av, extend;
module.exports = {
    init() {
        extend = base.getExtend();
        user = base.getObject(tableName);
        av = base.getAV();
    },
    getSelect(data){
        return data;
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    singIn(mobile, smsCode){
        av.User.signUpOrlogInWithMobilePhone(mobile, smsCode).then(function(success) {
        }, function(error) {
        });
    },
    singOut(){
        
    },
    requestSmsCode(mobile){
        return av.Cloud.requestSmsCode(mobile).then(function (success) {
            console.log(success);
        }, function (error) {
            console.log(error);
        });
    },
}