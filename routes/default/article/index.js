'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let article = require('../../../lib/models/article').createNew();
let AV = require('leanengine');
let pager = require('../../../lib/component/pager');
let flash = require('connect-flash');

let data = extend(config.data, {
    title: `${config.data.name} - 博客`,
    headerTitle: '博客',
    currentPage: 'article',
    pageType: 'article'
});


//首页
router.get('/', (req, res) => {
    data = extend(data, {
        flash: {success: req.flash('success'), error: req.flash('error')}
    });
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let options = {page,limit};
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
        })
    ).then(() => { res.render('default/article', data); });
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
                data = extend(data, {article:item});
                resolve();
            });
        })
    ).then(() => {
        res.render('default/article/detail', data);
    });

});

module.exports = router;