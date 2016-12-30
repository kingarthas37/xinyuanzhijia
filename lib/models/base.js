'use strict';
let av;
module.exports = {
    getAV(){
        av = require('leanengine');
        return av;
    },
    getObject(name){
        return this.getAV().Object.extend(name);
    },
    getExtend(){
        return require('xtend');
    },
    getConfig(){
        return require('../config');
    },
    getRequest(){
        return require('request');
    },
    getAsync(){
        return require('async');
    },
    getRouter(){
        return require('express').Router();
    },
    isUserLogin(response, returnUrl){
        this.getAV();
        if(!av.User.current()) {
           return response.redirect(`/admin/login?return=${encodeURIComponent(returnUrl)}`);
        }
    }
};
