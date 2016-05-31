'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

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
    let produceMethod = getQueryData(req.body['select-product-method']);
    let category1 = getQueryData(req.body['select-category-1']);
    let category2 = getQueryData(req.body['select-category-2']);
    updateQueryData(produceMethod,category1,category2);
    
    let bannerId = parseInt(req.body['select-banner']);
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
    product.set('productMethod',produceMethod);
    product.set('category1',category1);
    product.set('category2',category2);
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
    productHistory.set('productMethod',produceMethod);
    productHistory.set('category1',category1);
    productHistory.set('category2',category2);
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

//对array或字符串数据处理,返回array
function getQueryData(value) {
    if(Object.prototype.toString.call(value) === '[object Array]') {
        value = value.map(function(item) {
            return parseInt(item);
        });
        return value;
    }
    return [parseInt(value)];
}

//筛选空的分类
function updateQueryData(...items) {
    let itemNan = [];
    items.forEach((item,i)=> {
        item.forEach((_item,_i)=> {
            if(!_item) {
                itemNan.push(_i);
            }
        });
    });
    itemNan = Array.from(new Set(itemNan)); //es6数组去重
    items.forEach(item => {
        itemNan.forEach((_item) => {
            item.splice(_item,1);
        });
    });
}


module.exports = router;