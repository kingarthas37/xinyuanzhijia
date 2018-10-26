'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let ProductMethod = AV.Object.extend('ProductMethod');
let base = require('../../../lib/models/base');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加产品类型`,
    currentTag: 'product-settings',
    currentPage: 'product-method'
});

router.get('/', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user:req.AV.user
    });

    res.render('admin/product-method/add', data);

});


router.post('/', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let name = req.body['name'];
    let label = req.body['label'];
    let index = parseInt(req.body['index']);
 
    let productMethod = new ProductMethod();

    productMethod.save({
        name:name,
        label:label,
        index:index
    }).done(()=> {
        req.flash('success', '添加产品类型成功!');
        res.redirect('/admin/product-method');
    });
    
});


module.exports = router;