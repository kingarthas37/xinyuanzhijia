'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let article = require('../../../lib/models/article').createNew();
let articleCategory = require('../../../lib/models/article-category').createNew();
let base = require('../../../lib/models/base');
let markdown = require('markdown').markdown;

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 文章编辑`,
    currentTag: 'article',
    currentPage: 'article'
});

router.get('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    AV.Promise.when(
        new AV.Promise(resolve => {
            articleCategory.getArticleCategory({limit: 999}).then(result => {
                data = extend(data, {articleCategory: result.items});
                resolve();
            });
        })
    ).then(() => { res.render('admin/article/add', data); } );
});


router.post('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let articleCategoryId = parseInt(req.body['articleCategoryId']);
    let content = req.body['content'];
    let name = req.body['name'];
    let image = req.body['image'];
    let taoBaoLink = req.body['taoBaoLink'];
    let videoLink = req.body['video-link'];
    let detailImages = req.body['detail-images'];
    let status = req.body['status'] ? 1 : 0;
    let weiBoLink = req.body['weiBoLink'];
    let originalLink = req.body['originalLink'];
    article.add({articleCategoryId,content,name,image,taoBaoLink,videoLink, detailImages,status, weiBoLink, originalLink}).then(() => {
        req.flash('success', '文章添加成功!');
        res.redirect('/admin/article');
    });
});

module.exports = router;