'use strict';

let router = require('express').Router();
var AV = require('leanengine');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let product = require('../../../lib/models/product');

let data = extend(config.data, {
    title: `${config.data.name} - 批量导入在途订单`,
    currentTag:'tools',
    currentPage: 'import-order'
});
let base = require('../../../lib/models/base');


//首页
router.get('/', (req, res) => {

    base.isAdminUserLogin(req,res);  //判断是否登录

    data = extend(data,{
        user:req.currentUser
    });

    res.render('admin/import-order', data);

});

router.post('/data', (req, res) => {
    let importData = req.body['import-data'];
    let result = [];
    if (importData) {
        async.forEachLimit(JSON.parse(importData), 20, function(imData, callback){
                product.getProductByNameEn(imData.name).then(item => {
                    imData.isTrue = false;
                    imData.productId = '';
                    imData.nameCn = '';
                    imData.stock = '';
                    imData.reserve = '';
                    imData.mainImage = '';
                    if (item) {
                        imData.isTrue = true;
                        imData.productId = item.get('productId');
                        imData.nameCn = item.get('name');
                        imData.stock = item.get('stock');
                        imData.reserve = item.get('reserve');
                        imData.mainImage = item.get('mainImage');
                    }
                    result.push(imData);
                    callback();
                });
        }, function(err){
            if(err) {
                console.log('import data error:' + err);
            }
            res.send({result});
        });
    }

});

router.post('/save-data', (req, res) => {
    let productId = parseInt(req.body['productId']);
    let reserve = parseInt(req.body['reserve']);
    let newReserve = parseInt(req.body['newReserve']);
    let p = AV.Object.extend('Product');
    let query = new AV.Query(p);
    query.equalTo('productId', productId);
    query.first().then(result => {
        if (result) {
            result.set('reserve', (reserve+newReserve));
            result.save().then(() => {
                res.send({success:1});
            });
        } else {
            res.send({success:'商品ID错误!'});
        }
    });
});

module.exports = router;