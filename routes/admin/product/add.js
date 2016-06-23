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
let ProductProperty = AV.Object.extend('ProductProperty');

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

    res.cookie('x_lc_sign',data.x_lc_sign);
    res.cookie('x_lc_session',req.AV.user._sessionToken);

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
    let productMethod = getQueryData(req.body['select-product-method']);
    let category1 = getQueryData(req.body['select-category-1']);
    let category2 = getQueryData(req.body['select-category-2']);
    updateQueryData(productMethod,category1,category2);
    
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
    
    let productData = {name,nameEn,mainImage,productMethod,category1,category2,bannerId,detail,detailEn,description,review,property,propertyEn,instruction,instructionEn,use,useEn,detailImage,video};
    
    product.save(productData).then(result => {
        let query = new AV.Query(Product);
        query.equalTo('objectId',result.id);
        return query.first();
    }).then(result => {

        let productId = result.get('productId');
        productData = extend(productData, {productId});
        return productHistory.save(productData);
        
    }).then(() => {
        
        let productProperty = new ProductProperty();
        return productProperty.save({
            productId:productData.productId
        });
        
    }).then(() => {
        req.flash('success', '添加商品成功!');
        res.redirect(`/admin/product?product-method-id=${product.get('productMethod')[0]}&category1-id=${product.get('category1')[0]}&category2-id=${product.get('category2')[0]}`);
    },err => console.info(err));
    
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