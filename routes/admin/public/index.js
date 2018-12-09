'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');

//class
let Product = AV.Object.extend('Product');
let base = require('../../../lib/models/base');
let pro = require('../../../lib/models/product').createNew();
var spider = require('../../../lib/spider');
var https = require('https');

let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');
let orderTrack = require('../../../lib/models/order-track');
var isArray = require('util').isArray;
//let ProductProperty = AV.Object.extend('ProductProperty');


let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品列表页`,
    currentTag: 'product',
    currentPage: 'product-index',
    watermark:config.watermark
});

//首页
router.get('/', (req, res) => {

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : 60;
    let order = req.query.order;
    let onsale = req.query.onsale ? parseInt(req.query.onsale) : 0;

    let productMethodId = req.query['product-method-id'] ? parseInt(req.query['product-method-id']) : 0;
    let category1Id = req.query['category1-id'] ? parseInt(req.query['category1-id']) : 0;
    let category2Id = req.query['category2-id'] ? parseInt(req.query['category2-id']) : 0;
    let search = req.query['search'] ? req.query['search'].trim() : '';
    let productTitle = onsale == 1 ? '上架产品列表' : '下架产品列表';
    let isShortStock = req.query['is-short-stock'] ? (req.query['is-short-stock'] == 'true' ? true : '') : '';
    let isUpdateStock = req.query['is-update-stock'] ? req.query['is-update-stock'] : '';
    let updateStockDate = req.query['update-stock-date'] ? req.query['update-stock-date'] : '';
    let adminStock = req.query['stock'] || '';
    let hot = req.query['hot'] || '';
    let isTranslation = req.query['is-translation'] ? (req.query['is-translation'] == 'true' ? true : '') : '';
    let isSales = req.query['is-sales'] || '';
    let parentProductId = req.query['parent-product-id'] ? parseInt(req.query['parent-product-id']) : '';
    let colorTag = req.query['color-tag'] ? parseInt(req.query['color-tag']) : '';
    if ((isShortStock || updateStockDate || adminStock || isUpdateStock) && !order) {
        order = 'updatedAt';
    } else if (!order) {
        order = 'createdAt';
    }
    let isPublic = true;
    data = extend(data, {
        search,
        flash: {success: req.flash('success'), error: req.flash('error')},
        user: req.AV.user,
        productMethodId,
        category1Id,
        category2Id,
        category1: [],
        category2: [],
        mainImage:[],
        onsale,
        productTitle,
        limit,
        isShortStock,
        isUpdateStock,
        updateStockDate,
        adminStock,
        order,
        hot,
        isTranslation,
        parentProductId,
        isSales,
        colorTag,
        isPublic
    });

    let options = {search, page, limit, onsale, productMethodId, category1Id, category2Id, order, isShortStock, isUpdateStock, updateStockDate, adminStock, hot, isTranslation, parentProductId, isSales, colorTag, isPublic};
    AV.Promise.when(
        //获取count
        new AV.Promise(resolve => {
            pro.getProducts(options, true).then(count => {
                data = extend(data, {
                    pager: pager.init(page, limit, count),
                    pagerHtml: pager.initHtml({
                        page, limit, count,
                        url: '/admin/product',
                        serialize: {
                            page,
                            search,
                            'product-method-id':productMethodId,
                            'category1-id':category1Id,
                            'category2-id':category2Id,
                            onsale,
                            'is-short-stock':isShortStock,
                            'is-update-stock':isUpdateStock,
                            'update-stock-date':updateStockDate,
                            'stock':adminStock,
                            order,
                            hot,
                            'is-translation': isTranslation,
                            parentProductId,
                            'is-sales':isSales,
                            'color-tag':colorTag,
                            'is-public':isPublic
                        }
                    })
                });
                resolve();
            });
        }),

        //查询当前页所有数据
        new AV.Promise(resolve => {
            pro.getProducts(options, false).then(items => {
                items.forEach(n => {
                    n.createdDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.createdAt.getMonth() + 1}/${n.createdAt.getDate()}`;
                    n.updatedDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.updatedAt.getMonth() + 1}/${n.updatedAt.getDate()}`;

                    let mainImage = n.get('mainImage');
                    if(mainImage) {
                        for(let i in mainImage) {
                            if(!n.mainImage) {
                                n.mainImage = mainImage[i].url;
                            }
                        }
                    }
                    if(!n.get('offlineTag')) {
                        n.set('offlineTag', {'updateTotaobaoImage':0,'updateTotaobaoTitle':0,'updateTotaobaoContent':0});
                    }
                });
                data = extend(data, {product: items});
                resolve();
            });
        }),

        //查询productMethod
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductMethod);
            query.ascending('index');
            query.find().then(productMethod => {
                data = extend(data, {productMethod});
                resolve();
            });

        }),

        //查询category1
        new AV.Promise(resolve => {
            if(!productMethodId) {
                return resolve();
            }

            let query = new AV.Query(ProductCategory1);
            query.equalTo('productMethodId', productMethodId);
            query.ascending('index');
            query.find().then(category1 => {
                data = extend(data, {category1});
                resolve();
            });
        }),

        //查询categoty2
        new AV.Promise(resolve => {

            if (!category1Id) {
                return resolve();
            }

            let query = new AV.Query(ProductCategory2);
            query.equalTo('category1Id', category1Id);
            query.ascending('index');
            query.find().then(category2 => {
                data = extend(data, {category2});
                resolve();
            });

        })
    ).then(() => res.render('admin/public', data));

});

module.exports = router;