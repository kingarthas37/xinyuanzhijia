'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let product = require('../../../lib/models/product').createNew();
let orderTrack = require('../../../lib/models/order-track').createNew();
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let data = extend(config.data, {
    title: `${config.data.name} - 脚本`,
currentTag:'tools',
    currentPage: 'import-order'
});
let base = require('../../../lib/models/base');


//首页
router.get('/', (req, res) => {

    base.isAdminUserLogin(req,res);  //判断是否登录
    let page = req.query['page'] || 1;
    product.getProducts({'limit':1000, 'page':parseInt(page), 'select':'nameEn,productId'}).then(result => {
        let index = 0;
        async.forEachLimit(result, 5, function(item, callback){
            //item.set('name', item.get('name').toUpperCase().trim().replace(/\t/g,' ').replace(/\s+/g,' '));
            item.set('nameEn', item.get('nameEn').toUpperCase().trim().replace(/\t/g,' ').replace(/\s+/g,' '));
          //  item.set('reserve', 0);
            item.save().then(() => {
                index++;
                console.log('index:'+index,'productId:'+ item.get('productId'));
                callback();
            });
        });
    });

    res.send({'success':1});
});

router.get('/get-mobile', (req, res) => {
    base.isAdminUserLogin(req,res);  //判断是否登录
    let page = req.query['page'] || 1;
    let limit = req.query['limit'] || 1000;
    let mobileArray = [];
    let mobileStr = [];
    orderTrack.getOrdersByCreateAt(limit, page).then(items => {
        if (items) {
            items.forEach(item => {
                let mobile = item.get('shippingAddress');
                mobile = mobile.match(/((((13[0-9])|(15[^4])|(18[0,1,2,3,5-9])|(17[0-8])|(147))\d{8}))?/g);
                mobile.forEach(m => {
                    if (m != '') {
                        mobileArray.push(m.trim());
                    }
                });
            });
        }
        if (mobileArray) {
            mobileArray.sort();
            let tempStr = '';
            for (var i in mobileArray) {
                if(mobileArray[i] != tempStr) {
                    mobileStr.push(mobileArray[i]);
                    tempStr=mobileArray[i];
                } else {
                    continue;
                }
            }
        }
        res.send(mobileStr.toString());
    });
});

router.get('/get-product', (req, res) => {
    let page = parseInt(req.query['page']) || 1;
    let limit = parseInt(req.query['limit']) || 1000;
    let productMethodId = req.query['product-method-id'] ? parseInt(req.query['product-method-id']) : 3;
    let category1Id = req.query['category1-id'] ? parseInt(req.query['category1-id']) : 0;
    let category2Id = req.query['category2-id'] ? parseInt(req.query['category2-id']) : 0;
    let onsale = req.query.onsale ? parseInt(req.query.onsale) : 0;
    let select = 'detail, mainImage, name, use, instruction, detailImage';
    let options = {page, limit, onsale, productMethodId, category1Id, category2Id, select};
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProducts(options, false).then(items => {
                if (items) {
                    items.forEach(n => {
                        let mainImage = n.get('mainImage');
                        if(mainImage) {
                            for(let i in mainImage) {
                                if(!n.mainImage) {
                                    n.mainImage = mainImage[i].url.replace('ac-QuiPuWpJ.clouddn.com','lc-QuiPuWpJ.cn-n1.lcfile.com');
                                }
                            }
                        }
                    });
                }
                data = extend(data, {product: items});
                resolve();
            });
        }),
        //查询category1
        new AV.Promise(resolve => {
            if(!category1Id) {
                return resolve();
            }

            let query = new AV.Query(ProductCategory1);
            query.equalTo('category1Id', category1Id);
            query.ascending('index');
            query.first().then(category1 => {
                data = extend(data, {category1});
                resolve();
            });
        }),

        //查询categoty2
        new AV.Promise(resolve => {

            if (!category2Id) {
                return resolve();
            }

            let query = new AV.Query(ProductCategory2);
            query.equalTo('category2Id', category2Id);
            query.ascending('index');
            query.first().then(category2 => {
                data = extend(data, {category2});
                resolve();
            });
        })
    ).then(() => res.render('admin/crontab', data));
});

module.exports = router;