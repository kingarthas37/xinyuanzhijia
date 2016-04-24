'use strict';

let router = require('express').Router();
let AV = require('leanengine');

router.get('/', function(req, res) {
    AV.User.logOut();
    res.redirect('/');
});

module.exports = router;