'use strict';

let user = require('../../../lib/models/common-member').createNew();
let productWish = require('../../../lib/models/product-wish').createNew();
let product = require('../../../lib/models/product').createNew();
let config = user.getConfig();
let router = user.getRouter();
let AV = user.getAV();

let async = require('async');
let extend = require('xtend');

require('../../../lib/utils');

let data = extend(config.data, {
    title:`${config.data.name}我的收藏`,
    headerTitle:'我的收藏',
    currentPage: 'user-wish'
});

router.get('/', (req,res) => {
    let sessionData = req.cookies.login;
    user.isWebUserLogin(req,res);
    let member = user.getDecodeByBase64(sessionData);
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let order = 'createdAt';
    productWish.getWishByCommonMemberId({'commonMemberId':member.id, page, limit, order}).then(result => {
        let items = [];
        async.forEachLimit(result.items, 5, function (res, callback) {
            product.getProductById(res.get('productId')).then(value => {
                value.updatedAt = res.updatedAt;
                items.push(value);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('user wish:' + err);
            }
            data = extend(data, {'count':result.count, items});
            res.render('default/user/wish', data);
        });
    });

});

router.get('/ajax', (req,res) => {
    let sessionData = req.cookies.login;
    user.isWebUserLogin(req,res);
    let member = user.getDecodeByBase64(sessionData);
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let order = 'createdAt';
    productWish.getWishByCommonMemberId({'commonMemberId':member.id, page, limit, order}).then(result => {
        let items = [];
        async.forEachLimit(result.items, 5, function (res, callback) {
            product.getProductById(res.get('productId')).then(value => {
                value.updatedAt = res.updatedAt;
                items.push(value);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('user wish:' + err);
            }
            res.send({items});
        });
    });
});

router.get('/add/:productId', (req,res) => {
    let sessionData = req.cookies.login;
    if(!req.cookies.login) {
        res.send({success: -1});
    } else {
        let member = user.getDecodeByBase64(sessionData);
        let productId = req.params.productId ? req.params.productId : null;
        if (productId && member.id) {
            productWish.add({'productId':productId,'commonMemberId':member.id})
            res.send({success:1});
        } else {
            res.send({success:0});
        }
    }
});

//保存userinfo
router.get('/edit/:productId', (req, res) => {
    let sessionData = req.cookies.login;
    if(!req.cookies.login) {
        res.send({success: -1});
    } else {
        let member = user.getDecodeByBase64(sessionData);
        let productId = req.params.productId ? req.params.productId : null;
        if (productId && member.id) {
            productWish.edit({'productId':productId,'commonMemberId':member.id,'status':false}).then(()=>{
                res.send({success:1});
            });
        } else {
            res.send({success:0});
        }
    }
});

module.exports = router;