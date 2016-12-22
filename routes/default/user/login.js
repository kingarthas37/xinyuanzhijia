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

router.get('/toLogin/:mobile/:smsCode', (req, res) => {
    let mobile = req.params.mobile;
    let smsCode = req.params.smsCode;
    user.singIn(mobile, smsCode).then(data => {
        let result = {code:200};
        if(("code" in data)) {
            result = data;
        }
        res.send(result);
    });

});

router.get('/getSmsCode/:mobile', (req, res) => {
    
    let mobile = req.params.mobile;
    user.requestSmsCode(mobile).then(data=> {
        res.send(data);
    });
});


module.exports = router;