'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let product = require('../../../lib/models/product').createNew();
let orderTrack = require('../../../lib/models/order-track').createNew();

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
    console.log('aaaaa');
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
    let page = req.query['page'] || 1;
    let limit = req.query['limit'] || 1000;
    let productMethodId = req.query['product-method-id'] ? parseInt(req.query['product-method-id']) : 3;
    let category1Id = req.query['category1-id'] ? parseInt(req.query['category1-id']) : 0;
    let onsale = req.query.onsale ? parseInt(req.query.onsale) : 0;
    let select = 'detail, mainImage, name, use, instruction, detailImage';
    let options = {page, limit, onsale, productMethodId, category1Id, select};
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProducts(options, false).then(items => {
                items.forEach(n => {
                    let mainImage = n.get('mainImage');
                    if(mainImage) {
                        for(let i in mainImage) {
                            if(!n.mainImage) {
                                n.mainImage = mainImage[i].url;
                            }
                        }
                    }
                });
                data = extend(data, {product: items});
                resolve();
            });
        })
    ).then(() => res.render('admin/crontab', data));
});

module.exports = router;