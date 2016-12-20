'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');

let user = require('../../../lib/models/user');
let AV = require('leanengine');
user.createNew();

router.get('/', (req, res) => {
    res.render('default/user/login');

});

router.post('/postLogin', (req, res) => {
    if(req.AV.user) {
        return res.redirect('/');
    }

    let returnUrl = req.query.return;
    let mobile = req.body.mobile;
    let smsCode = req.body.smsCode;
    
    console.log(user.singIn(mobile, smsCode));
    res.send(returnUrl);

});

router.get('/getSmsCode/:mobile', (req, res) => {
    
    let mobile = req.params.mobile;
    user.requestSmsCode(mobile);
    
    res.send('');
});

module.exports = router;