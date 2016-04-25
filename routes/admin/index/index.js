'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let async = require('async');
let extend = require("xtend");

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 首页`,
    currentPage: 'index'
});

//首页
router.get('/', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
    data = extend(data,{
        user:req.AV.user
    });
    
    res.render('admin/index', data);

});

module.exports = router;