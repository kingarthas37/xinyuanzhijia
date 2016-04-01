'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require("xtend");
 
var config = '../../../lib/config';
  
var data = extend(config.data,{
    title: '产品编辑-首页',
    currentPage: 'product',
    user:null
});


//首页
router.get('/', function (req, res, next) {

    res.render('admin/index', data);

});

module.exports = router;