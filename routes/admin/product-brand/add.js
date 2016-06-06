'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let ProductBrand = AV.Object.extend('ProductBrand');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加产品类型`,
    currentTag: 'product',
    currentPage: 'product-brand'
});

router.get('/', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    data = extend(data, {
        user:req.AV.user
    });

    res.render('admin/product-brand/add', data);

});


router.post('/', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let name = req.body['name'];
    let label = req.body['label'];
 
    let productBrand = new ProductBrand();

    productBrand.save({
        name:name,
        label:label
    }).done(()=> {
        req.flash('success', '添加产品类型成功!');
        res.redirect('/admin/product-brand');
    });
    
});


module.exports = router;