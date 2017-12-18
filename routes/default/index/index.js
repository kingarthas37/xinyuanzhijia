'use strict';

let user = require('../../../lib/models/common-member').createNew();
let AV = user.getAV();
let orderTrack = require('../../../lib/models/order-track').createNew();
let product = require('../../../lib/models/product').createNew();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

/**
 * 产品列表相关数据
 */
// let product = require('../../../lib/models/product').createNew();
// let product_config = product.getConfig();
// let AV = product.getAV();
// let productCategory1 = require('../../../lib/models/product-category1').createNew();


let data = extend(config.data, {
    title:`${config.data.name}首页`,
    currentPage: 'index'
});

//首页
router.get('/', (req, res) => {
    if (req.cookies.login) {
        let member = user.getDecodeByBase64(req.cookies.login);
        data = extend(data, member);
    }

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let methodId = [21];
    // console.log('/Users/Ebates/Desktop/chamWork/H5/xinyuanzhijia/routes/default/index/home.js 开始画 首页')
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProductsByUpdateStockDate(20, methodId, 1).then(items => {
                data = extend(data, {'newReleases':items});
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            product.getProductsByPageViews(20, methodId, 1).then(items => {
                data = extend(data, {'hot':items});
                resolve();
            });
        })
        /*new AV.Promise(resolve => {
            let result = [];
            let productIds = [];
            orderTrack.getOrdersByCreateAt(10, 1).then(items => {
                async.forEachLimit(items, 1, function(item, callback){
                    async.forEachLimit(item.get('productId'), 1, function(productId, callback){
                        if (productIds.indexOf(productId) < 0) {
                            product.getProductByIdAndMethod(parseInt(productId), methodId).then(value => {
                                if (value) {
                                    result.push(value);
                                }
                                productIds.push(productId);
                                callback();
                            });
                        } else {
                            callback();
                        }
                    }, function(err) {
                        callback();
                    });
                }, function(err){
                    if(err) {
                        console.log('product open sell:' + err);
                    }
                    data = extend(data, {'openSell':result});
                    resolve();
                });
            });
        })*/
    ).then(() => {
        res.render('default/index/index',data);
    });

});

module.exports = router;