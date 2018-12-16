'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let articleTag = require('../../../lib/models/article-tag').createNew();
let base = require('../../../lib/models/base');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加文章标签`,
    currentTag: 'article',
    currentPage: 'article-tag'
});

router.get('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    res.render('admin/article-tag/add', data)
});


router.post('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let name = req.body['name'];
    articleTag.add({name}).then(() => {
        req.flash('success', '添加文章标签成功!');
        res.redirect('/admin/article-tag');
    });
});

module.exports = router;