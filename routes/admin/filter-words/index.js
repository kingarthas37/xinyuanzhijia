'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: `${config.data.name} - 过滤词管理`,
    currentPage: 'filter-words'
});
let base = require('../../../lib/models/base');


//首页
router.get('/', (req, res) => {

    base.isAdminUserLogin(req,res);  //判断是否登录

    data = extend(data,{
        user:req.currentUser
    });

    res.render('admin/filter-words', data);

});

router.post('/', (req, res) => {

    base.isAdminUserLogin(req,res);  //判断是否登录
    console.log(req.body);
    let isFilter = req.body['isFilter'];
    let oldWords = req.body['oldWords[]'];
    let newWords = req.body['newWords[]e'];
    data = extend(data,{
        user:req.currentUser
    });
    console.log(isFilter);
    console.log(oldWords);
    console.log(newWords);
    res.render('admin/filter-words', data);

});

module.exports = router;