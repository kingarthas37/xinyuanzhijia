'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: `${config.data.name} - 首页`,
    currentPage: 'index'
});
let base = require('../../../lib/models/base');


//首页
router.get('/', (req, res) => {

    base.isAdminUserLogin(req,res);  //判断是否登录
    
    data = extend(data,{
        user:req.currentUser
    });
    
    res.render('admin/index', data);

});

module.exports = router;