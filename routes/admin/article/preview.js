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
    title: `${config.data.titleAdmin} - 文章预览`,
    currentTag: 'article',
    currentPage: 'article'
});


//预览文章页
router.get('/:articleId',(req,res)=> {

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
                data = extend(data, {article: item, content: markdown.toHTML(item.get('content'))});
                resolve();
            });
        })
    ).then(() => { res.render('admin/article/preview', data); } );
});


module.exports = router;