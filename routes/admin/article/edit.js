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

router.get('/:articleId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let articleId = parseInt(req.params.articleId);
    AV.Promise.when(
        new AV.Promise(resolve => {
            articleCategory.getArticleCategory({limit: 999}).then(result => {
                data = extend(data, {articleCategory: result.items});
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            article.getArticleByArticleId(articleId).then(item => {
                data = extend(data, {article: item});
                resolve();
            });
        })
    ).then(() => {
        res.render('admin/article/edit', data); } );
});


router.post('/:articleId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let articleId = parseInt(req.params.articleId);
    let articleCategoryId = parseInt(req.body['articleCategoryId']);
    let content = req.body['content'];
    let name = req.body['name'];
    let image = req.body['image'];
    let taoBaoLink = req.body['taoBaoLink'];
    let videoLink = req.body['video-link'];
    let detailImages = req.body['detail-images'];
    let status = req.body['status'] ? 1 : 0;
    let weiBoLink = req.body['weiBoLink'];
    article.update({articleCategoryId,content,name,image,taoBaoLink,videoLink, detailImages, status, weiBoLink}, articleId).then(() => {
        req.flash('success', '文章编辑成功!');
        res.redirect('/admin/article');
    });
});

module.exports = router;