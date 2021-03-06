'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');
var markdown = require("markdown").markdown;

//class
let ProductMethod = AV.Object.extend('ProductMethod');
let base = require('../../../lib/models/base');


//lib
let config = require('../../../lib/config');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品类型`,
    currentTag: 'product-settings',
    currentPage: 'product-method'
});

router.get('/:productMethodId', (req, res, next) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    var productMethodId = parseInt(req.params.productMethodId);

    data = extend(data, {
        user: req.AV.user
    });
    
    let query = new AV.Query(ProductMethod);
    query.equalTo('productMethodId',productMethodId);
    query.first().then( item => {
        data = extend(data,{
            productMethod:item
        });
        res.render('admin/product-method/edit',data);
    });

});

router.post('/:productMethodId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let name = req.body['name'];
    let label = req.body['label'];
    let index = parseInt(req.body['index']);

    let productMethodId = parseInt(req.params.productMethodId);

    let query = new AV.Query(ProductMethod);
    query.equalTo('productMethodId',productMethodId);
    query.first().then(item => {
        
        return item.save({
            name:name,
            label:label,
            index:index
        });
        
    }).then(() => {
        req.flash('success', '编辑商品类型成功!');
        res.redirect('/admin/product-method');
    });

});

module.exports = router;