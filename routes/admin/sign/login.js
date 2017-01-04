'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 管理员登录`,
    currentPage: 'login'
});

router.get('/',function(req,res,next) {
    
    data = extend(data,{
        flash: {success: req.flash('success'),error: req.flash('error')}
    });
    
    res.render('admin/sign/login',data);
    
});


router.post('/',(req,res) => {

    if(req.currentUser) {
        return res.redirect('/admin');
    }

    let returnUrl = req.query.return;
    let username = req.body.username;
    let password = req.body.password;
    
    AV.User.logIn(username, password, {
        success: function(user) {
            res.saveCurrentUser(user);
            res.redirect(returnUrl ? decodeURIComponent(returnUrl) : '/admin');
        },
        error: function(user, error) {
            req.flash('error',error.message);
            res.redirect('/admin/login');
        }
    });

});

module.exports = router;