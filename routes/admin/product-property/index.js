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
let config = require('../../../lib/config');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品属性`,
    currentTag: 'product',
    currentPage: 'product-property'
});


router.get('/:productId',(req,res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
    data = extend(data, {
        user: req.AV.user
    });

    let productId = parseInt(req.params.productId);
    
    
    AV.Promise.when(
        
        new AV.Promise(resolve => {
            
            let query = new AV.Query(Product);
            query.equalTo('productId',productId);
            query.select('name','productId');
            
            query.first().then( product => {
                data = extend(data,{product});
                resolve();
            });
        }),
        
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductProperty);
            query.equalTo('productId',productId);

            query.first().then(item => {

                
                //如果存在,编辑,否则直接创建productproperty实例
                if(item) {
                    data = extend(data,{
                        productProperty:item
                    });
                    return resolve();
                }
                
                //创建实例
                let productProperty = new ProductProperty();
                productProperty.set({
                    productId
                }).save().then(item => {
                    data = extend(data,{
                        productProperty:item
                    });
                    resolve();
                });

            });
            
        })
        
    ).then(() => res.render('admin/product-property', data));
    
    
    

});


//保存产品购买链接
router.post('/purchase-link/:productId', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let productId = parseInt(req.params.productId);
    let purchaseLink = req.body['purchase-link'];
    let purchaseLinkComment = req.body['purchase-link-comment'];
    
    let query = new AV.Query(ProductProperty);
    query.equalTo('productId',productId);
    query.first().then(item => {
        
        return item.save({
            purchaseLink,
            purchaseLinkComment
        });
        
    }).then(() => {
        req.flash('success', '编辑产品购买链接成功!');
        res.redirect('/admin/product');
    });

});

module.exports = router;