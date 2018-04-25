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
    let options = {page,limit};
    AV.Promise.when(
        new AV.Promise(resolve => {
            article.getArticle(options).then(result => {
                let count = result.count;
                data = extend(data, {
                    pager: pager.init(page, limit, count),
                    pagerHtml: pager.initHtml({
                        page, limit, count,
                        url: '/admin/article',
                        serialize: {
                            page
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

module.exports = router;