'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require("xtend");
var markdown = require("markdown").markdown;

//class
let Product = AV.Object.extend('Product');
let ProductHistory = AV.Object.extend('ProductHistory');

let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let Banner = AV.Object.extend('ProductBanner');

//lib
let config = require('../../../lib/config');

var data = extend(data,{
    title:'产品编辑-编辑产品',
    currentTagPage:'product',
    currentPage:'product-edit'
});


//编辑产品页
router.get('/:productId', function (req, res, next) {

    //if(!req.AV.user) {
    //    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}
    
    var productId = parseInt(req.params.productId);

    data = extend(data,{
        user:req.AV.user
    });

    
    AV.Promise.when(
        new AV.Promise(resolve => {
            let query = new AV.Query(Product);
            query.equalTo('productId', productId);
            query.first().done(item => {
                data = extend(data, {
                    product:item
                });
                
                //查询category2 items
                let category1Id = item.get('category1Id');
                let query2 = new AV.Query(ProductCategory2);
                query2.equalTo('productCategory1Id',category1Id);
                query2.find().then(items => {
                    data = extend(data, {
                        category2:items
                    });
                    resolve();
                });
            });
        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(Banner);
            query.find().then(items => {
                data = extend(data, {
                    banner:items
                });
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.find().then(items => {
                data = extend(data, {
                    category1:items
                });
                
                resolve();
            });
        })
    ).then(()=> res.render('admin/product/edit',data));
    
});

router.post('/', function (req, res, next) {

    //if(!req.AV.user) {
    //    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}
    
    var mdCodeBanner = req.body['md-code-banner'];
    var mdCodeVideo = req.body['md-code-video'];
    var mdCodeName = req.body['md-code-name'];
    var mainImage = req.body['main-image'];
    var mdCodeNameEn = req.body['md-code-name-en'];
    var mdCodeReview = req.body['md-code-review'];
    var mdCodeProperty = req.body['md-code-property'];
    var mdCodePropertyEn = req.body['md-code-property-en'];
    var mdCodeInstruction = req.body['md-code-instruction'];
    var mdCodeInstructionEn = req.body['md-code-instruction-en'];
    var mdCodeDetail = req.body['md-code-detail'];
    var mdCodeDetailEn = req.body['md-code-detail-en'];
    var mdCodeImage = req.body['md-code-image'];
    var categoryId = parseInt(req.body['select-category']) || 1;

    var productLink = req.body['product-link'];
    var shopLink = req.body['shop-link'];
    var taobaoLink = req.body['taobao-link'];
    var comment = req.body['comment'];

    productLink = utils.urlCompleting(productLink);
    shopLink = utils.urlCompleting(shopLink);
    taobaoLink = utils.urlCompleting(taobaoLink);

    var productId = parseInt(req.body['product-id']);

    data = extend(data,{
        flash: { success:req.flash('success'), error:req.flash('error') },
        user:req.AV.user
    });
    
    var query = new AV.Query(Product);
    query.equalTo('productId', productId);
    
    query.first().then(result => {

        result.set('banner', mdCodeBanner);
        result.set('video', mdCodeVideo);
        result.set('name', mdCodeName);
        result.set('mainImage',mainImage);
        result.set('nameEn', mdCodeNameEn);
        result.set('review', mdCodeReview);
        result.set('property', mdCodeProperty);
        result.set('propertyEn',mdCodePropertyEn);
        result.set('instruction', mdCodeInstruction);
        result.set('instructionEn', mdCodeInstructionEn);
        result.set('detail', mdCodeDetail);
        result.set('detailEn', mdCodeDetailEn);
        result.set('image', mdCodeImage);
        result.set('categoryId', categoryId);
        result.set('productLink',productLink);
        result.set('shopLink',shopLink);
        result.set('taobaoLink',taobaoLink);
        result.set('comment',comment);

        return result.save();
        
    }).then(result => {
 
        data = extend(data, {
            product: result
        });
       
        let query = new AV.Query(Banner);
       
        return query.find();
        
    }).then(results => {
 
        data = extend(data, {
            banner: results
        });

        let query = new AV.Query(Category);
        return query.find();
        
    }).then(results => {
 
        data = extend(data, {
            category: results
        });
        
        var productHistory = new ProductHistory();
        
        productHistory.set('productId',productId);
        productHistory.set('banner', mdCodeBanner);
        productHistory.set('video', mdCodeVideo);
        productHistory.set('name', mdCodeName);
        productHistory.set('nameEn', mdCodeNameEn);
        productHistory.set('mainImage',mainImage);
        productHistory.set('review', mdCodeReview);
        productHistory.set('property', mdCodeProperty);
        productHistory.set('propertyEn',mdCodePropertyEn);
        productHistory.set('instruction', mdCodeInstruction);
        productHistory.set('instructionEn', mdCodeInstructionEn);
        productHistory.set('detail', mdCodeDetail);
        productHistory.set('detailEn', mdCodeDetailEn);
        productHistory.set('image', mdCodeImage);
        productHistory.set('categoryId', categoryId);
        productHistory.set('productLink',productLink);
        productHistory.set('shopLink',shopLink);
        productHistory.set('taobaoLink',taobaoLink);
        productHistory.set('comment',comment);

        return productHistory.save();
        
    }).then(() => {
        req.flash('success', '编辑商品成功!');
        res.redirect('/product?categoryId='+ categoryId);
    });
    
});

module.exports = router;