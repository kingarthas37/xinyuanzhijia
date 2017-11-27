'use strict';

let user = require('../../../lib/models/common-member').createNew();
let productClick = require('../../../lib/models/product-click').createNew();
let product = require('../../../lib/models/product').createNew();
let config = user.getConfig();
let router = user.getRouter();
let AV = user.getAV();

let async = require('async');
let extend = require('xtend');

require('../../../lib/utils');

let data = extend(config.data, {
    title:`${config.data.name}我的足迹`,
    headerTitle:'我的足迹',
    currentPage: 'user-footmark'
});

router.get('/', (req,res) => {
    let sessionData = req.cookies.login;
    user.isWebUserLogin(req,res);
    let member = user.getDecodeByBase64(sessionData);
    let limit = 50;
    productClick.getProductClickByMemberId(member.id, limit).then(result => {
        let items = [];
        async.forEachLimit(result, 5, function (res, callback) {
            product.getProductById(res.get('productId')).then(value => {
                value.createdAt = res.get('createdAt');
                items.push(value);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('user foot mark:' + err);
            }
            data = extend(data, {items});
            res.render('default/user/footmark', data);
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