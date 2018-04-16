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
    title: `${config.data.titleAdmin} - 编辑文章分类`,
    currentTag: 'article',
    currentPage: 'article-category'
});

router.get('/:articleCategoryId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let articleCategoryId = parseInt(req.params.articleCategoryId);
    articleCategory.getArticleCategoryByArticleCategoryId(articleCategoryId).then(result => {
        data = extend(data, {'articleCategory':result});
        res.render('admin/article-category/edit', data);
    });
});


router.post('/:articleCategoryId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let articleCategoryId = parseInt(req.params.articleCategoryId);
    let name = req.body['name'];
    let parentId = req.body['parentId']
    articleCategory.update({name, parentId}, articleCategoryId).then(() => {
        req.flash('success', '编辑文章分类成功!');
        res.redirect('/admin/article-category');
    });
});

module.exports = router;