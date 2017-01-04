'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: '管理员注册',
    currentPage: 'register'
});

router.get('/',function(req,res,next) {

    //注册不开放，跳转到登录
    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    
    data = extend(data,{
        flash: {success: req.flash('success'), error: req.flash('error')}
    });
    
    res.render('admin/sign/register',data);

});


router.post('/',function(req,res,next) {

    //注册不开放，跳转到登录
    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    
    var username = req.body.username;
    var password = req.body.password;
    
    var user = new AV.User();
    user.set('username',username);
    user.set('password', password);
    
    user.signUp(null, {
        success: function(user) {
            req.flash('success', '注册成功!');
            res.redirect('/');
        },
        error: function(user, error) {
            req.flash('error',error.message);
            res.redirect('/register');
        }
    });

});

module.exports = router;