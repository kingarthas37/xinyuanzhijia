'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require("xtend");

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: '管理员登录',
    currentPage: 'login'
});

router.get('/',function(req,res,next) {
    
    //if(req.AV.user) {
    //    return res.redirect('/');
    //}
    
    data = extend(data,{
        flash: {success: req.flash('success'), error: req.flash('error')}
    });
    
    res.render('admin/sign/login',data);
    
});


router.post('/',function(req,res,next) {

    if(req.AV.user) {
        return res.redirect('/admin/product');
    }

    var returnUrl = req.query.return;
    var username = req.body.username;
    var password = req.body.password;
    
    AV.User.logIn(username, password, {
        success: function(user) {
            res.redirect(returnUrl ? decodeURIComponent(returnUrl) : '/');
        },
        error: function(user, error) {
            req.flash('error',error.message);
            res.redirect('/login');
        }
    });

});

module.exports = router;