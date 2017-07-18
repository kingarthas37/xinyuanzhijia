'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var async = require('async');
var extend = require('xtend');
var markdown = require("markdown").markdown;

//class
let Product = AV.Object.extend('Product');
let ProductHistory = AV.Object.extend('ProductHistory');

let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let Banner = AV.Object.extend('ProductBanner');
let base = require('../../../lib/models/base');

//lib
let config = require('../../../lib/config');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品`,
    currentTag: 'product',
    currentPage: 'product-edit',
    watermark:config.watermark
});


//编辑产品页
router.get('/:productId', function (req, res, next) {

    base.isAdminUserLogin(req, res);  //判断是否登录

    res.cookie('x_lc_sign',data.x_lc_sign);
    res.cookie('x_lc_session',req.AV.user._sessionToken);

    var productId = parseInt(req.params.productId);

    data = extend(data, {
        user: req.AV.user
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
        getBanner(resolve) {
            let query = new AV.Query(Banner);
            query.find().then(items => {
                data = extend(data, {
                    banner: items
                });
                resolve();
            });
        },
        getMethod(resolve) {
            let query = new AV.Query(ProductMethod);
            query.find().then(productMethod => {
                data = extend(data,{productMethod});
                resolve();
            });
        },
        getHistory(resolve) {
          
            let query = new AV.Query(ProductHistory);
            query.equalTo('productId',productId);
            query.descending('productHistoryId');
            query.limit(3);
            query.select('productHistoryId','productId','description','use','property','name','nameEn','review','instruction','detail');
            query.find().then(productHistory => {
                data = extend(data,{productHistory});
                resolve();
            });
            
        },
        
        //处理main images
        getMainImage:['getProduct',function(resolve) {
            
            if(data.product.get('mainImage')) {
                let mainImages = [];
                let images = data.product.get('mainImage');
                for(let i in images) {
                    mainImages.push({id:i, url:images[i].url , isMainImage: images[i].isMainImage });
                }
                data = extend(data, {
                    mainImage:mainImages
                });
            } else {
                data = extend(data, {mainImage:[]});
            }
            resolve();
        }],
        
        getCategory1:['getProduct',function(resolve) {
            
            let category1 = [];
            async.forEachSeries(data.product.get('productMethod'), function(productMethodId,cb) {
                let query = new AV.Query(ProductCategory1);
                query.equalTo('productMethodId',productMethodId);
                query.find().then(results => {
                    category1.push(results);
                    cb();
                });
            },err => {
                data = extend(data,{category1});
                resolve();
            });
        }],

        getCategory2:['getProduct',function(resolve) {
            let category2 = [];
            async.forEachSeries(data.product.get('category1'), function(category1Id,cb) {
                let query = new AV.Query(ProductCategory2);
                query.equalTo('category1Id',category1Id);
                query.find().then(results => {
                    category2.push(results);
                    cb();
                });
            },err => {
                data = extend(data,{category2});
                resolve();
            });
        }]
        
    },(err,results) => res.render('admin/product/edit', data));
    
   

});

router.post('/:productId', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let name = req.body['name'];
    let nameEn = req.body['name-en'];
    let sampleName = req.body['sample-name'];
    let shopName = req.body['shop-name'];
    let mainImage = req.body['main-image'] ? JSON.parse(req.body['main-image']) : null;
    
    let productMethod = getQueryData(req.body['select-product-method']);
    let category1 = getQueryData(req.body['select-category-1']);
    let category2 = getQueryData(req.body['select-category-2']);
    updateQueryData(productMethod,category1,category2);
    
    let bannerId = parseInt(req.body['select-banner']);
    let detail = req.body['detail'];
    let description = req.body['description'];
    let review = req.body['review'];
    let property = req.body['property'];
    let instruction = req.body['instruction'];
    let use = req.body['use'];
    let detailImage = req.body['detail-image'];

    let productId = parseInt(req.params.productId);

    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
 
    query.first().then(product => {
        
        return product.save({
            name,
            nameEn,
            sampleName,
            shopName,
            mainImage,
            productMethod,
            category1,
            category2,
            bannerId,
            detail,
            description,
            review,
            property,
            instruction,
            use,
            detailImage
        });
        
    }).then(() =>{
 
        let productHistory = new ProductHistory();
        return productHistory.save({
            productId,
            name,
            nameEn,
            sampleName,
            shopName,
            mainImage,
            productMethod,
            category1,
            category2,
            detail,
            description,
            review,
            property,
            instruction,
            use,
            detailImage
        });
        
    }).then(product => {
        req.flash('success', '编辑商品成功!');
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