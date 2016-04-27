'use strict';

let router = require('express').Router();
let AV = require('leanengine');

router.get('/', function(req, res) {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
    AV.User.logOut();
    res.redirect('/admin');
});

module.exports = router;