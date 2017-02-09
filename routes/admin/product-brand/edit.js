'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');
var markdown = require("markdown").markdown;

//class
let ProductBrand = AV.Object.extend('ProductBrand');
let base = require('../../../lib/models/base');

//lib
let utils = require('../../../lib/utils');
let config = require('../../../lib/config');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑品牌`,
    currentTag: 'product',
    currentPage: 'product-brand'
});

router.get('/:productBrandId', (req, res, next) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    var productBrandId = parseInt(req.params.productBrandId);

    data = extend(data, {
        user: req.AV.user
    });
    
    let query = new AV.Query(ProductBrand);
    query.equalTo('productBrandId',productBrandId);
    query.first().then( item => {
        data = extend(data,{
            productBrand:item
        });
        res.render('admin/product-brand/edit',data);
    });

});

router.post('/:productBrandId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let productBrandId = parseInt(req.params.productBrandId);
    let name = req.body['name'];
    let type = req.body['type'];
    let brandName = req.body['brand-name'];
    let brandLogoImage = req.body['brand-logo-image'];
    let brandDetail = req.body['brand-detail'];
    let authorName = req.body['author-name'];
    let authorImage = req.body['author-image'];
    let authorDetail = req.body['author-detail'];
    let url = req.body['url'];
    let comment = req.body['comment'];

    url = url.map(item => utils.urlCompleting(item));


    let query = new AV.Query(ProductBrand);
    query.equalTo('productBrandId',productBrandId);
    query.first().then(item => {
        
        return item.save({
            name,type,brandName,brandLogoImage,brandDetail,authorName,authorImage,authorDetail,url,comment
        });
        
    }).then(() => {
        req.flash('success', '编辑品牌成功!');
        res.redirect('/admin/product-brand');
    });
    
});

module.exports = router;