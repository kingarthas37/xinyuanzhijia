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
    title: `${config.data.titleAdmin} - 编辑文章标签`,
    currentTag: 'article',
    currentPage: 'article-tag'
});

router.get('/:articleTagId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let articleTagId = parseInt(req.params.articleTagId);
    articleTag.getArticleTagByArticleTagId(articleTagId).then(result => {
        data = extend(data, {'articleTag':result});
        res.render('admin/article-tag/edit', data);
    });
});


router.post('/:articleTagId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let articleTagId = parseInt(req.params.articleTagId);
    let name = req.body['name'];
    articleTag.update({name}, articleTagId).then(() => {
        req.flash('success', '编辑文章标签成功!');
        res.redirect('/admin/article-tag');
    });
});

module.exports = router;