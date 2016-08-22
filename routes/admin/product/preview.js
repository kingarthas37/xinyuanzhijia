'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');
let markdown = require('markdown').markdown;

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');
var shot = require('../../../lib/component/shot');

//class
let Product = AV.Object.extend('Product');
let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品预览`,
    currentTag: 'product',
    currentPage: 'product-preview',
    watermark:config.watermark
});


//预览产品页
router.get('/:productId',(req,res)=> {

    var productId = parseInt(req.params.productId);

    data = extend(data, {
        user: req.AV.user
    });
    
    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    query.first().done(product => {

        data = extend(data,{
            name:markdown.toHTML(product.get('name')),
            nameEn:markdown.toHTML(product.get('nameEn')),
            detail: markdown.toHTML(product.get('detail')),
            review: markdown.toHTML(product.get('review')),
            property: markdown.toHTML(product.get('property')),
            instruction: markdown.toHTML(product.get('instruction')),
            use: markdown.toHTML(product.get('use')),
            detailImage: markdown.toHTML(product.get('detailImage'))
        });

        res.render('admin/product/preview-web', data);
        
    });
    
});


//编辑时预览产品页
router.post('/preview-taobao', function (req, res) {
    
    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    data = extend(data, {
        user: req.AV.user
    });
    
    let name = req.body['name'];
    let nameEn = req.body['name-en'];
    let banner = req.body['banner'];
    let detail = req.body['detail'];
    let detailEn = req.body['detail-en'];
    let review = req.body['review'];
    let property = req.body['property'];
    let propertyEn = req.body['property-en'];
    let instruction = req.body['instruction'];
    let instructionEn = req.body['instruction-en'];
    let use = req.body['use'];
    let useEn = req.body['use-en'];
    let detailImage = req.body['detail-image'];
    
    let productMethodId = parseInt(req.body['select-product-method']);
    let category1Id = parseInt(req.body['select-category-1']);
    let category2Id = parseInt(req.body['select-category-2']);

    data = extend(data,{
        name:name,
        nameEn:nameEn,
        banner:banner,
        detail: markdown.toHTML(detail),
        detailEn: markdown.toHTML(detailEn),
        review: markdown.toHTML(review),
        property: markdown.toHTML(property),
        propertyEn: markdown.toHTML(propertyEn),
        instruction: markdown.toHTML(instruction),
        instructionEn: markdown.toHTML(instructionEn),
        use: markdown.toHTML(use),
        useEn: markdown.toHTML(useEn),
        detailImage: markdown.toHTML(detailImage)
    });

    async.parallel([
        cb => {
            let query = new AV.Query(ProductMethod);
            query.equalTo('productMethodId',productMethodId);
            query.first().then(item => {
                data = extend(data,{
                    productMethodName:item.get('name')
                });
                cb();
            });
        },
        cb => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('category1Id',category1Id);
            query.first().then(item => {
                data = extend(data,{
                    category1Name:item.get('name')
                });
                cb();
            });
        },
        cb => {
            let query = new AV.Query(ProductCategory2);
            query.equalTo('category2Id',category2Id);
            query.first().then(item => {
                data = extend(data,{
                    category2Name:item.get('name')
                });
                cb();
            });
        }
    ], () => res.render('admin/product/preview-taobao', data));
    
});


//shot
router.post('/shot', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
    let name = req.body.name.substr(0, 20);
    let html = req.body.html;
    let htmlHeight = parseInt(req.body.htmlHeight);

    shot({
        name:name,
        html:html,
        htmlHeight:htmlHeight
    }).then(function() {
        res.json({success:1});
    },function(err) {
        res.send(err);
    });

});

module.exports = router;