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
let newArticle = AV.Object.extend('Article');

let data = extend(config.data, {
    title: `${config.data.name} - 文章`,
    currentTag:'article',
    currentPage: 'article'
});


//首页
router.get('/', (req, res) => {
    data = extend(data, {
        flash: {success: req.flash('success'), error: req.flash('error')}
    });
    article.isAdminUserLogin(req,res);  //判断是否登录
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let search = req.query.search || null;
    let articleCategoryId = req.query['article-category-id'] ? parseInt(req.query['article-category-id']) : null;
    let isParent = true;
    let options = {page, limit, search, articleCategoryId,isParent};
    data = extend(data, {
        search,
        articleCategoryId,
        isParent
    });
    AV.Promise.when(
        new AV.Promise(resolve => {
            articleCategory.getArticleCategory({limit: 999}).then(result => {
                data = extend(data, {articleCategory: result.items});
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            article.getArticle(options).then(result => {
                let count = result.count;
                data = extend(data, {
                    pager: pager.init(page, limit, count),
                    pagerHtml: pager.initHtml({
                        page, limit, count,
                        url: '/admin/article',
                        serialize: {
                            page,
                            search,
                            articleCategoryId,
                        }
                    }),
                    article:result.items
                });
                resolve();
            });
        })
    ).then(() => { res.render('admin/article', data); });
});


router.post('/remove/:articleId',(req,res)=> {

    let articleId = parseInt(req.params.articleId);

    let query = new AV.Query(AV.Object.extend('Article'));
    query.equalTo('articleId',articleId);
    query.first().then(item => {
        item.destroy();
    }).then(() => { res.send({success: 1}); });

});

router.get('/copy/:articleId',(req,res)=> {

    let articleId = parseInt(req.params.articleId);

    let query = new AV.Query(AV.Object.extend('Article'));
    query.equalTo('articleId',articleId);
    query.first().then(item => {
        let act = new newArticle();
        let articleData = {
            'name': item.get('name'),
            'articleCategoryId': item.get('articleCategoryId'),
            'content': item.get('content'),
            'image': item.get('image'),
            'taoBaoLink': item.get('taoBaoLink'),
            'videoLink': item.get('videoLink')
        };
        return act.save(articleData);
    }).then(() => {
        req.flash('success', '复制文章成功!');
        res.redirect('/admin/article');

    },err => console.info(err));

});

router.get('/seed/:articleId',(req,res) => {
    let parentArticleId = parseInt(req.params.articleId);
    let options = {parentArticleId};
    let list,articleCategoryList;
    AV.Promise.when(
        new AV.Promise(resolve => {
            article.getArticle(options).then(result => {
                list = extend(list, {
                    article:result.items,
                    count:result.count
                });
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            articleCategory.getArticleCategory({limit: 999}).then(result => {
                articleCategoryList =  result.items;
                resolve();
            });
        })
    ).then(() => { res.send({list,articleCategoryList}) });
});

router.get('/article-category-count/:articleCategoryId',(req,res) => {
    let articleCategoryId = parseInt(req.params.articleCategoryId);
    let limit = 1;
    let status = 1;
    let options = {articleCategoryId,limit, status};
    let count = 0;
    AV.Promise.when(
        new AV.Promise(resolve => {
            article.getArticle(options).then(result => {
                count = result.count;
                resolve();
            });
        })
    ).then(() => { res.send({count}) });
});

module.exports = router;