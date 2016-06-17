'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');
var markdown = require("markdown").markdown;

//class
let Product = AV.Object.extend('Product');
let ProductProperty = AV.Object.extend('ProductProperty');

//lib
let config = require('../../../lib/config');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 复制产品`,
    currentTag: 'product',
    currentPage: 'product-copy'
});


//编辑产品页
router.get('/:productId', function (req, res, next) {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let productId = parseInt(req.params.productId);
    let product = new Product();
    
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {
        
        let productData = {
            name:'(新建产品)' + result.get('name'),
            nameEn:result.get('nameEn'),
            mainImage:result.get('mainImage'),
            productMethod:result.get('productMethod'),
            category1:result.get('category1'),
            category2:result.get('category2'),
            bannerId:result.get('bannerId'),
            detail:result.get('detail'),
            detailEn:result.get('detailEn'),
            description:result.get('description'),
            review:result.get('review'),
            property:result.get('property'),
            propertyEn:result.get('propertyEn'),
            instruction:result.get('instruction'),
            instructionEn:result.get('instructionEn'),
            use:result.get('use'),
            useEn:result.get('useEn'),
            detailImage:result.get('detailImage'),
            video:result.get('video')
        };

        return product.save(productData);
        
    }).then(result => {
      
        let query = new AV.Query(Product);
        query.equalTo('objectId',result.id);
        return query.first();
        
    }).then(result => {

        let productProperty = new ProductProperty();
        return productProperty.save({
            productId:result.get('productId')
        });
        
    }).then(() => {
        req.flash('success', '复制产品成功!');
        res.redirect('/admin/product');
    },err => console.info(err));

});

module.exports = router;