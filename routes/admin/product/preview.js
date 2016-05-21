'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require("xtend");

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');

//class
let Product = AV.Object.extend('Product');


let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品预览`,
    currentTag: 'product',
    currentPage: 'product-preview'
});


//预览产品页
router.post('/', function (req, res, next) {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
    var mdCodeInfo = req.body['md-code-info'] || '';
    var mdCodeBanner = req.body['md-code-banner'] || '';
    var mdCodeVideo = req.body['md-code-video'] || '';
    var mdCodeName = req.body['md-code-name'] || '';
    var mdCodeReview = req.body['md-code-review'] || '';
    var mdCodeProperty = req.body['md-code-property'] || '';
    var mdCodeInstruction = req.body['md-code-instruction'] || '';
    var mdCodeDetail = req.body['md-code-detail'] || '';
    var mdCodeImage = req.body['md-code-image'] || '';

    data = extend(data,{
        mdCodeInfo: markdown.toHTML(mdCodeInfo),
        mdCodeBanner: markdown.toHTML(mdCodeBanner),
        mdCodeVideo: markdown.toHTML(mdCodeVideo),
        mdCodeName: markdown.toHTML(mdCodeName),
        mdCodeReview: markdown.toHTML(mdCodeReview),
        mdCodeProperty: markdown.toHTML(mdCodeProperty),
        mdCodeInstruction: markdown.toHTML(mdCodeInstruction),
        mdCodeDetail: markdown.toHTML(mdCodeDetail),
        mdCodeImage: markdown.toHTML(mdCodeImage)
    });
    
    res.render('product/preview', data);

});


//shot
router.post('/shot', function (req, res, next) {

    if(!req.AV.user) {
        return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    }
    
    var name = req.body.name.substr(0, 20);
    var html = req.body.html;
    var htmlHeight = parseInt(req.body.htmlHeight);

    shot({
        name:name,
        html:html,
        htmlHeight:htmlHeight
    }).then(function() {
        res.json({
            "success": 1
        });
    },function(err) {
        res.send(err);
    });

});

module.exports = router;