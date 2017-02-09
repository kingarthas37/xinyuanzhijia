'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');

//class
let Product = AV.Object.extend('Product');
let ProductProperty = AV.Object.extend('ProductProperty');

//lib
let utils = require('../../../lib/utils');
let config = require('../../../lib/config');
let base = require('../../../lib/models/base');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品属性`,
    currentTag: 'product',
    currentPage: 'product-property'
});


router.get('/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let viewport = req.query.viewport;

    data = extend(data, {
        user: req.AV.user,
        viewport: viewport ? `viewport-${viewport}` : ''
    });
    
    AV.Promise.when(
        new AV.Promise(resolve => {

            let query = new AV.Query(Product);
            query.equalTo('productId', productId);
            query.select('name', 'productId');

            query.first().then(product => {
                data = extend(data, {product});
                resolve();
            });
        }),

        new AV.Promise(resolve => {

            let query = new AV.Query(ProductProperty);
            query.equalTo('productId', productId);

            query.first().then(item => {
                data = extend(data, {
                    productProperty: item
                });
                resolve();
            });

        })
    ).then(() => res.render('admin/product-property', data));


});


//保存产品购买链接
router.post('/purchase-link/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let purchaseLink = req.body['purchase-link'];
    let purchaseLinkComment = req.body['purchase-link-comment'];

    purchaseLink = purchaseLink.map(item => utils.urlCompleting(item));

    let query = new AV.Query(ProductProperty);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            purchaseLink,
            purchaseLinkComment
        });

    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});


//保存淘宝链接
router.post('/shop-link/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let shopLink = req.body['shop-link'];
    let shopLinkComment = req.body['shop-link-comment'];

    shopLink = shopLink.map(item => utils.urlCompleting(item));

    let query = new AV.Query(ProductProperty);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            shopLink,
            shopLinkComment
        });

    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});

//保存库存
router.post('/stock/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let stock = parseInt(req.body.stock);
    let sales = parseInt(req.body.sales);
    
    let query = new AV.Query(ProductProperty);
    query.equalTo('productId', productId);
    query.first().then(item => {
        
        return item.save({
            stock,sales
        });

    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});

//保存设置
router.post('/settings/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let price = parseInt(req.body.price);
    let country = req.body.country;
    let settingsComment = req.body['settings-comment'];
    let isHandmade = req.body['is-handmade'] ? true : false;
    let isDocument = req.body['is-document'] ? true : false;
    let isOnly = req.body['is-only'] ? true :false;
    let isOnsale = req.body['is-onsale'] ? true :false;
    let isHot = req.body['is-hot'] ? true :false;
    
    let query = new AV.Query(ProductProperty);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            price,
            country,
            settingsComment,
            isHandmade,
            isDocument,
            isOnly,
            isOnsale,
            isHot
        });

    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});


module.exports = router;