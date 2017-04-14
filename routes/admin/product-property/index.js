'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');

//class
let Product = AV.Object.extend('Product');

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

    let query = new AV.Query(Product);
    query.equalTo('productId', productId);

    query.first().then(item => {
        data = extend(data, {
            product: item
        });
        res.render('admin/product-property', data);
    });

});


//保存产品购买链接
router.post('/purchase-link/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let purchaseLink = req.body['purchase-link'];
    
    purchaseLink = purchaseLink.map(item => utils.urlCompleting(item));

    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            purchaseLink
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

    shopLink = shopLink.map(item => utils.urlCompleting(item));

    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            shopLink
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
    
    let query = new AV.Query(Product);
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
    let isHandmade = req.body['is-handmade'] ? true : false;
    let isDocument = req.body['is-document'] ? true : false;
    let isRefund = req.body['is-refund'] ? true : false;
    let isOnly = req.body['is-only'] ? true :false;
    let isOnsale = req.body['is-onsale'] ? true :false;
    let isHot = req.body['is-hot'] ? true :false;
    let isShortStock = req.body['is-short-stock'] ? true : false;
    let arrivedTime = parseInt(req.body['arrived-time']);
    let onsaleDate = new Date(req.body['onsale-date']);
    
    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            price,
            country,
            isHandmade,
            isDocument,
            isRefund,
            isOnly,
            isOnsale,
            isHot,
            isShortStock,
            arrivedTime,
            onsaleDate
        });

    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});


//保存内容管理
router.post('/content-manage/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let productBrandId = parseInt(req.body['brand-id']);
    let video = req.body['video'];
    
    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            productBrandId,
            video
        });
        
    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});

//附件管理
router.post('/attachment-manage/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let attachment = req.body['attachment'];

    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    query.first().then(item => {

        return item.save({
            attachment
        });

    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});


//保存备注
router.post('/set-comment/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productId = parseInt(req.params.productId);
    let comment = req.body['comment'];


    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    
    query.first().then(item => {

        return item.save({
            comment
        });

    }).then(() => {
        res.redirect(`/admin/product-property/${productId}?viewport=window`);
    });

});

module.exports = router;