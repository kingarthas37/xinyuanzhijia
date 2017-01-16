'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let utils = require('../../../lib/utils');
let config = require('../../../lib/config');
let base = require('../../../lib/models/base');

//class
let ProductBrand = AV.Object.extend('ProductBrand');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加产品类型`,
    currentTag: 'product',
    currentPage: 'product-brand'
});

router.get('/', (req, res) => {

    base.isUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user:req.AV.user
    });

    res.render('admin/product-brand/add', data);

});


router.post('/', (req, res) => {

    base.isUserLogin(req, res);  //判断是否登录

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
 
    let productBrand = new ProductBrand();

    productBrand.save({
        name,type,brandName,brandLogoImage,brandDetail,authorName,authorImage,authorDetail,url,comment
    }).done(()=> {
        req.flash('success', '添加品牌成功!');
        res.redirect('/admin/product-brand');
    });
    
});


module.exports = router;