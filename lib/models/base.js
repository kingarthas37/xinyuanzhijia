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
    isAdminUserLogin(req,res){
        this.getAV();
        if(!req.currentUser) {
           return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
        }
    },
    isWebUserLogin(req,res) {
        this.getAV();
        if(!req.cookies.sessionId) {
            return res.redirect(`/user/login?return=${encodeURIComponent(req.originalUrl)}`);
        }
    }
};
