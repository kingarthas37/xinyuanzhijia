'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let article = require('../../../lib/models/article').createNew();
let articleCategory = require('../../../lib/models/article-category').createNew();
let AV = require('leanengine');
let pager = require('../../../lib/component/pager');
let flash = require('connect-flash');
let markdown = require('markdown').markdown;

let data = extend(config.data, {
    title: `${config.data.name} - 博客`,
    headerTitle: '博客',
    currentPage: 'article',
    pageType: 'article'
});


//首页
router.get('/', (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let articleCategoryId = req.query.catid ? parseInt(req.query.catid) : '';
    let options = {page,limit, articleCategoryId};
    AV.Promise.when(
        new AV.Promise(resolve => {
            article.getArticle(options).then(result => {
                let count = result.count;
                data = extend(data, {
                    count,
                    article:result.items
                });
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            articleCategory.getArticleCategory({'limit':999}).then(category => {
                data = extend(data, {articleCategory:category.items, articleCategoryCount: category.count});
                resolve();
            });
        })
    ).then(() => { res.render('default/article', data); });
});

router.get('/ajax', (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let articleCategoryId = req.query.catid ? parseInt(req.query.catid) : '';
    let options = {page,limit, articleCategoryId};
    AV.Promise.when(
        new AV.Promise(resolve => {
            article.getArticle(options).then(result => {
                let count = result.count;
                data = extend(data, {
                    count,
                    items:result.items
                });
                resolve();
            });
        })
    ).then(() => { res.send(data); });
});


router.get('/:articleId',(req,res)=> {
    let articleId = parseInt(req.params.articleId);
    AV.Promise.when(
        new AV.Promise(resolve => {
            article.getArticleByArticleId(articleId).then(result => {
                article.updateArticlePageViews(result);
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            article.getArticleByArticleId(articleId).then(item => {
				item.set('content', markdown.toHTML(item.get('content')));
                data = extend(data, {article:item});
                resolve();
            });
        })
    ).then(() => {
        res.render('default/article/detail', data);
    });

});

module.exports = router;