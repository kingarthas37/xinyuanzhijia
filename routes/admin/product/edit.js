'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require("xtend");
var markdown = require("markdown").markdown;

//class
let Product = AV.Object.extend('Product');
let ProductHistory = AV.Object.extend('ProductHistory');

let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let Banner = AV.Object.extend('ProductBanner');

//lib
let config = require('../../../lib/config');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品`,
    currentTag: 'product',
    currentPage: 'product-edit'
});


//编辑产品页
router.get('/:productId', function (req, res, next) {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    var productId = parseInt(req.params.productId);

    data = extend(data, {
        user: req.AV.user
    });
    
    AV.Promise.when(
        new AV.Promise(resolve => {
            let query = new AV.Query(Product);
            
            query.equalTo('productId', productId);
            
            query.first().done(item => {
                
                data = extend(data, {
                    product: item,
                    mainImage:[]
                });
                
                //处理main images
                if(item.get('mainImage')) {
                    
                    let mainImages = [];
                    let images = item.get('mainImage');
                    
                    for(let i in images) {
                        mainImages.push({id:i, url:images[i].url , isMainImage: images[i].isMainImage });
                    }
                    
                    data = extend(data, {
                        mainImage:mainImages
                    });
                }
                
                //查询category2 items
                let category1Id = item.get('category1Id');
                let query2 = new AV.Query(ProductCategory2);
                query2.equalTo('category1Id', category1Id);
                query2.find().then(items => {
                    data = extend(data, {
                        category2: items
                    });
                    resolve();
                });
                
            });
        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(Banner);
            query.find().then(items => {
                data = extend(data, {
                    banner: items
                });
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.find().then(items => {
                data = extend(data, {
                    category1: items
                });

                resolve();
            });
        })
    ).then(()=> res.render('admin/product/edit', data));

});

router.post('/:productId', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let name = req.body['name'];
    let nameEn = req.body['name-en'];
    let mainImage = req.body['main-image'] ? JSON.parse(req.body['main-image']) : null;
    let category1Id = parseInt(req.body['select-category-1']);
    let category2Id = parseInt(req.body['select-category-2']);
    let bannerId = parseInt(req.body['banner-id']);
    let detail = req.body['detail'];
    let detailEn = req.body['detail-en'];
    let description = req.body['description'];
    let review = req.body['review'];
    let property = req.body['property'];
    let propertyEn = req.body['property-en'];
    let instruction = req.body['instruction'];
    let instructionEn = req.body['instruction-en'];
    let use = req.body['use'];
    let useEn = req.body['use-en'];
    let detailImage = req.body['detail-image'];
    let video = req.body['video'];

    let productId = parseInt(req.params.productId);

    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(item => {

        let product = new Product();
        product.id = item.id;

        product.set('name', name);
        product.set('nameEn', nameEn);
        product.set('mainImage', mainImage);
        product.set('category1Id', category1Id);
        product.set('category2Id', category2Id);
        product.set('bannerId', bannerId);
        product.set('detail', detail);
        product.set('detailEn', detailEn);
        product.set('description', description);
        product.set('review', review);
        product.set('property', property);
        product.set('propertyEn', propertyEn);
        product.set('instruction', instruction);
        product.set('instructionEn', instructionEn);
        product.set('use', use);
        product.set('useEn', useEn);
        product.set('detailImage', detailImage);
        product.set('video', video);
        
        
        let productHistory = new ProductHistory();
        productHistory.set('productId',productId);
        productHistory.set('name', name);
        productHistory.set('nameEn', nameEn);
        productHistory.set('mainImage', mainImage);
        productHistory.set('category1Id', category1Id);
        productHistory.set('category2Id', category2Id);
        productHistory.set('bannerId', bannerId);
        productHistory.set('detail', detail);
        productHistory.set('detailEn', detailEn);
        productHistory.set('description', description);
        productHistory.set('review', review);
        productHistory.set('property', property);
        productHistory.set('propertyEn', propertyEn);
        productHistory.set('instruction', instruction);
        productHistory.set('instructionEn', instructionEn);
        productHistory.set('use', use);
        productHistory.set('useEn', useEn);
        productHistory.set('detailImage', detailImage);
        productHistory.set('video', video);
        productHistory.set('product',product);
        
        return productHistory.save();
        
    }).then(()=>{
        req.flash('success', '编辑商品成功!');
        res.redirect('/admin/product');
    });

});

module.exports = router;