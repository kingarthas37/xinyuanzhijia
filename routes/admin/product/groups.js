'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');

//class
let Product = AV.Object.extend('Product');
let ProductGroup = AV.Object.extend('ProductGroup');


let base = require('../../../lib/models/base');

//lib
let config = require('../../../lib/config');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品组合`,
    currentTag: 'product',
    currentPage: 'product-groups'
});


//编辑产品页
router.get('/:productId', function (req, res, next) {

    base.isAdminUserLogin(req, res);  //判断是否登录

    res.cookie('x_lc_sign',data.x_lc_sign);
    res.cookie('x_lc_session',req.AV.user._sessionToken);

    let productId = parseInt(req.params.productId);
    let productMethodId = req.query['product-method-id'];
    let category1Id = req.query['category1-id'];
    let category2Id = req.query['category2-id'];
    
    data = extend(data, {
        user: req.AV.user,
        productMethodId,
        category1Id,
        category2Id
    });
    
    async.auto({
        
        getProduct(resolve) {
            let query = new AV.Query(Product);
            query.equalTo('productId', productId);
            query.first().done(product => {
                data = extend(data, {product});
                resolve();
            });
        },
        getProductGroup(resolve) {
            let query = new AV.Query(ProductGroup);
            query.find().then(items => {
                data = extend(data, {
                    groups: items
                });
                resolve();
            });
        }
        
    },(err,results) => res.render('admin/product/groups', data));
    
});

router.post('/:productId', (req, res) => {

    let productId = parseInt(req.params.productId);
    let groups = req.body['groups'];
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    
    query.first().then(product => {
        
        return product.save({
            groups:JSON.parse(groups)
        });
        
    }).then(() => {
        res.send({
            success:1
        });
    });
    
});

module.exports = router;