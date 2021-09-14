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
let base = require('../../../lib/models/base');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加产品`,
    currentTag: 'product',
    currentPage: 'product-add'
});

router.get('/', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    res.cookie('x_lc_sign',data.x_lc_sign);
    res.cookie('x_lc_session',req.AV.user._sessionToken);

    let productMethodId = req.query['product-method-id'];
    let category1Id = req.query['category1-id'];
    let category2Id = req.query['category2-id'];
    
    data = extend(data, {
        user:req.AV.user,
        productMethodId,
        category1Id,
        category2Id,
        category1:[],
        category2:[]
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
            query.ascending('index');
            query.find().then(productMethod => {
                data = extend(data,{productMethod});
                resolve();
            });
        }),

        new AV.Promise(resolve => {

            if(!productMethodId) {
                return resolve();
            }
            
            let query = new AV.Query(ProductCategory1);
            query.equalTo('productMethodId',parseInt(productMethodId));
            query.ascending('index');
            return query.find().then(category1 => {
                data = extend(data,{category1});
                resolve();
            });

        }),

        new AV.Promise(resolve => {

            if(!category1Id) {
                return resolve();
            }

            let query = new AV.Query(ProductCategory2);
            query.equalTo('category1Id',parseInt(category1Id));
            query.ascending('index');
            return query.find().then(category2 => {
                data = extend(data,{category2});
                resolve();
            });

        })
        
    ).then(() => res.render('admin/product/add', data));

});


router.post('/', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录
    
    let name = req.body['name'];
    name = name.toUpperCase().trim().replace(/\t/g,' ').replace(/\s+/g,' ');
    let nameEn = req.body['name-en'];
    nameEn = nameEn.toUpperCase().trim().replace(/\t/g,' ').replace(/\s+/g,' ');
    let nameTb = req.body['name-tb'];
    nameTb = nameTb.toUpperCase().trim().replace(/\t/g,' ').replace(/\s+/g,' ');
    let mainImage = req.body['main-image'] ? JSON.parse(req.body['main-image']) : null;
    let productMethod = getQueryData(req.body['select-product-method']);
    let category1 = getQueryData(req.body['select-category-1']);
    let category2 = getQueryData(req.body['select-category-2']);
    updateQueryData(productMethod,category1,category2);
    
    let bannerId = parseInt(req.body['select-banner']);
    let detail = req.body['detail'];
    let review = req.body['review'];
    let property = req.body['property'];
    let instruction = req.body['instruction'];
    let use = req.body['use'];
    let detailImage = req.body['detail-image'];
    
    let product = new Product();
    let productHistory = new ProductHistory();
    let isPublic = req.body['is-public'] == 'true' ? true : false;
    
    product.save({
        name,
        nameEn,
        nameTb,
        mainImage,
        productMethod,
        category1,
        category2,
        bannerId,
        detail,
        review,
        property,
        instruction,
        use,
        detailImage,
        isPublic
    }).then(result => {
        let query = new AV.Query(Product);
        query.equalTo('objectId',result.id);
        return query.first();
    }).then(result => {

        let productId = result.get('productId');
        return productHistory.save({
            productId,
            name,
            nameEn,
            nameTb,
            mainImage,
            productMethod,
            category1,
            category2,
            detail,
            review,
            property,
            instruction,
            use,
            detailImage,
            isPublic
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