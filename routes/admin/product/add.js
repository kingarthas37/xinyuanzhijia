'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require("xtend");

let config = require('../../../lib/config');

//class
let Product = AV.Object.extend('Product');
let ProductHistory = AV.Object.extend('ProductHistory');

let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let Banner = AV.Object.extend('ProductBanner');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加产品`,
    currentTag: 'product',
    currentPage: 'product-index'
});

router.get('/', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    data = extend(data, {
        user:req.AV.user
    });
    
    AV.Promise.when(

        new AV.Promise(resolve => {
            let query = new AV.Query(Banner);
            return query.find().then(banner => {
                data = extend(data, {banner});
                resolve();
            });
        }),

        new AV.Promise(resolve => {
            let query = new AV.Query(ProductMethod);
            query.find().then(productMethod => {
                data = extend(data,{productMethod});
                resolve();
            });
        })
        
    ).then(() => res.render('admin/product/add', data));

});


router.post('/', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let name = req.body['name'];
    let nameEn = req.body['name-en'];
    let mainImage = req.body['main-image'] ? JSON.parse(req.body['main-image']) : null;
    let productMethodId = parseInt(req.body['select-product-method']);
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

    let product = new Product();
    let productHistory = new ProductHistory();

    product.set('name', name);
    product.set('nameEn', nameEn);
    product.set('mainImage', mainImage);
    product.set('productMethodId',productMethodId);
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
    
    productHistory.set('name', name);
    productHistory.set('nameEn', nameEn);
    productHistory.set('mainImage', mainImage);
    productHistory.set('productMethodId',productMethodId);
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

    productHistory.save().done(()=> {
        req.flash('success', '添加商品成功!');
        res.redirect('/admin/product');
    });
    
});


module.exports = router;