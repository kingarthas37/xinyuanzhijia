'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 首页`,
    currentPage: 'index'
});
let base = require('../../../lib/models/base');

let AV = base.getAV();

//首页
router.get('/', (req, res) => {

    base.isUserLogin(res, req.originalUrl);  //判断是否登录
    
    data = extend(data,{
        user:AV.User.current()
    });
    
    res.render('admin/index', data);

});

module.exports = router;