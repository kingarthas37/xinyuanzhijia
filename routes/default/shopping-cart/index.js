'use strict';

let user = require('../../../lib/models/common-member').createNew();
let shoppingCart = require('../../../lib/models/shopping-cart').createNew();
let product = require('../../../lib/models/product').createNew();
let config = user.getConfig();
let router = user.getRouter();
let AV = user.getAV();

let async = require('async');
let extend = require('xtend');

require('../../../lib/utils');

let data = extend(config.data, {
    title:`${config.data.name}我的购物足迹`,
    headerTitle:'我的购物足迹',
    currentPage: 'shopping-cart'
});

router.get('/', (req,res) => {
    let carts = req.cookies.xcarts;
    let sessionData = req.cookies.login;
    data = extend(data, {'items':[]});
    async.series([
        cb=> {
            if (carts && sessionData) {
                shoppingCart.setShoppingCartCookie(req,res,{carts}, -10);
                let member = user.getDecodeByBase64(sessionData);
                carts = shoppingCart.getDecodeByBase64(carts);
                async.forEachSeries(carts, function(res, callback){
                    shoppingCart.add({'productId':res.productId, 'count':res.count, 'commonMemberId':member.id}).then(() => {
                        callback();
                    });
                }, function(err) {
                    cb();
                });
            } else {
                cb();
            }
        },
        cb=> {
            if (sessionData) {
                let member = user.getDecodeByBase64(sessionData);
                shoppingCart.getShoppingCartsByMemberId(member.id, {'order':'updatedAt'}).then(result => {
                    async.forEachSeries(result, function(res, callback){
                        product.getProductById(res.get('productId')).then(item => {
                            item.set('count', res.get('count'));
                            data.items.push(item);
                            callback();
                        });
                    }, function(err) {
                        cb();
                    });
                });
            } else if (carts) {
                async.forEachSeries(carts, function(res, callback){
                    product.getProductById(res.productId).then(item => {
                        item.set('count', res.count);
                        data.items.push(item);
                        callback();
                    });
                }, function(err) {
                    cb();
                });
            } else {
                cb();
            }
        }
    ], function (err, values) {
        res.render('default/shopping-cart', data);
    });
});

router.post('/add', (req,res) => {
    let productId = parseInt(req.body['pid']);
    let count = parseInt(req.body['count']);
    if(req.cookies.login) {
        let sessionData = req.cookies.login;
        let member = user.getDecodeByBase64(sessionData);
        shoppingCart.add({productId, 'commonMemberId':member.id, count}).then(item => {
            res.send({'success':1});
        });
    } else {
        var carts = req.cookies.xcarts;
        if(carts) {
            carts[productId]['count'] = count;
            carts[productId]['productId'] = productId;
        } else {
            carts[productId]['count'] += count;
        }
        shoppingCart.setShoppingCartCookie(req,res,{carts}, 60*1000*60*24*36);
        res.send({'success':1});
    }
});

router.post('/delete', (req,res) => {
    let carts = req.cookies.xcarts;
    let sessionData = req.cookies.login;
    let success = 0;
    if (carts) {
        shoppingCart.setShoppingCartCookie(req,res,{carts}, -10);
        success = 1;
    }
    if (sessionData) {
        let member = user.getDecodeByBase64(sessionData);
        shoppingCart.deleteShoppingCartByMemberId(member.id);
        success = 1;
    }
    res.send({success});
});

module.exports = router;