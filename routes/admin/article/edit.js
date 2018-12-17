'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let article = require('../../../lib/models/article').createNew();
let articleCategory = require('../../../lib/models/article-category').createNew();
let articleTag = require('../../../lib/models/article-tag').createNew();
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
        }),
        new AV.Promise(resolve => {
            articleTag.getArticleTag({limit:999}).then(result => {
                data = extend(data, {articleTag: result.items});
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
    let summary = req.body['summary'];
    let name = req.body['name'];
    let image = req.body['image'];
    let taoBaoLink = req.body['taoBaoLink'];
    let videoLink = req.body['video-link'];
    let detailImages = req.body['detail-images'];
    let status = req.body['status'] ? 1 : 0;
    let weiBoLink = req.body['weiBoLink'];
    let originalLink = req.body['originalLink'];
    let englishName = req.body['englishName'];
    let imageWeitao = req.body['image-weitao'];
    let tag = req.body['tag'] || [];
    let parentArticleId = req.body['parent-article-id'] ? parseInt(req.body['parent-article-id']) : 0;
    let isParent = parentArticleId > 0 ? false : true;
    let sort = req.body['sort'] ? parseInt(req.body['sort']) : 0;
    if (tag.length == 1) {
        tag = [tag];
    }
    article.update({articleCategoryId,content,summary,name,image,taoBaoLink,videoLink, detailImages, status, weiBoLink, originalLink,englishName,imageWeitao,tag,isParent,parentArticleId,sort}, articleId).then(() => {
        if (parentArticleId > 0) {
            let isParent = true;
            article.updateArticleIsParent(isParent,parentArticleId).then(() => {
                req.flash('success', '文章编辑成功!');
                res.redirect('/admin/article');
            });
        } else {
            req.flash('success', '文章编辑成功!');
            res.redirect('/admin/article');
        }
    });
});

module.exports = router;