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
let base = require('../../../lib/models/base');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 复制产品`,
    currentTag: 'product',
    currentPage: 'product-copy'
});


//编辑产品页
router.get('/:productId', function (req, res, next) {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let product = new Product();
    
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {
        let productData = {
            name:'(新建产品) ' + result.get('name'),
            nameEn:result.get('nameEn'),
            sampleName:result.get('sampleName'),
            shopName:result.get('shopName'),
            mainImage:result.get('mainImage'),
            productMethod:result.get('productMethod'),
            category1:result.get('category1'),
            category2:result.get('category2'),
            bannerId:result.get('bannerId'),
            detail:result.get('detail'),
            review:result.get('review'),
            property:result.get('property'),
            instruction:result.get('instruction'),
            use:result.get('use'),
            detailImage:result.get('detailImage'),
            costPrice:(result.get('costPrice') == undefined ? 0 : result.get('costPrice')),
            price:(result.get('price') == undefined ? 0 : result.get('price')),
            originalPrice:(result.get('originalPrice') == undefined ? '0' : result.get('originalPrice'))
        };

        return product.save(productData);
        
    }).then(() => {
        req.flash('success', '复制产品成功!');
        res.redirect('/admin/product');
    },err => console.info(err));

});

//编辑产品页
router.get('/ten/:productId', function (req, res, next) {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let product = new Product();
    
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);

    query.first().then(result => {
        
        let productData = {
            name:'(新建产品) ' + result.get('name'),
            nameEn:result.get('nameEn'),
            sampleName:result.get('sampleName'),
            shopName:result.get('shopName'),
            mainImage:result.get('mainImage'),
            productMethod:result.get('productMethod'),
            category1:result.get('category1'),
            category2:result.get('category2'),
            bannerId:result.get('bannerId'),
            detail:result.get('detail'),
            review:result.get('review'),
            property:result.get('property'),
            instruction:result.get('instruction'),
            use:result.get('use'),
            detailImage:result.get('detailImage')
        };
        var i = 0;

        let arrs = [];
        while (i < 3) {
            arrs.push(productData);
            i++;
        }
        async.forEachLimit(arrs, 3, function(item, callback){
            product.save(item).then(()=> {
                callback();
            });
        }, function(err){
            if(err) {
                console.log('product copy ten error:' + err);
            }
            res.send({success:success, count:success.length});
        });
    });

});

module.exports = router;