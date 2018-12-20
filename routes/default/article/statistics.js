'use strict';

let article = require('../../../lib/models/article').createNew();
let request = article.getRequest();
let config = article.getConfig();
let router = article.getRouter();
let extend = article.getExtend();
let async = article.getAsync();
let AV = article.getAV();
let markdown = require('markdown').markdown;


router.get('/approval/:articleId', (req, res) => {
    let articleId = req.params.articleId ? parseInt(req.params.articleId) : null;
    let data = {success:0};
    if (articleId) {
        article.updateArticleApprovalByArticleId(articleId);
        data = {success:1};
    }
    res.send(data);
});

router.get('/share/:articleId', (req, res) => {
    let articleId = req.params.articleId ? parseInt(req.params.articleId) : null;
    let data = {success:0};
    if (articleId) {
        article.updateArticleShareByArticleId(articleId);
        data = {success:1};
    }
    res.send(data);
});

module.exports = router;