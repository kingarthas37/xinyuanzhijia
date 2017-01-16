'use strict';

let router = require('express').Router();
let AV = require('leanengine');

router.get('/', function(req, res) {

    if(!req.currentUser) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
    AV.User.logOut();
    res.clearCurrentUser();
    res.redirect('/admin');
});

module.exports = router;