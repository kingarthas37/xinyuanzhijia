'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');

//class
let Product = AV.Object.extend('Product');
let ProductProperty = AV.Object.extend('ProductProperty');

//lib
let utils = require('../../../lib/utils');
let config = require('../../../lib/config');
let base = require('../../../lib/models/base');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品标签`,
    currentTag: 'product',
    currentPage: 'product-tag'
});


router.get('/', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user: req.AV.user
    });

    res.render('admin/product-tag', data);
});

module.exports = router;