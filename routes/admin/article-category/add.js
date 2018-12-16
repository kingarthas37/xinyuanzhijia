'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let articleCategory = require('../../../lib/models/article-category').createNew();
let base = require('../../../lib/models/base');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加文章分类`,
    currentTag: 'article',
    currentPage: 'article-category'
});

router.get('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    res.render('admin/article-category/add', data)
});


router.post('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let name = req.body['name'];
    let parentId = req.body['parentId'];
    let icon = req.body['category-icon'];
    let isPublish = req.body['push-category'] == 'true' ? true : false;;
    articleCategory.add({name, parentId,icon,isPublish}).then(() => {
        req.flash('success', '添加文章分类成功!');
        res.redirect('/admin/article-category');
    });
});

module.exports = router;