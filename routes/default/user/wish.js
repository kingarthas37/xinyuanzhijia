'use strict';

let user = require('../../../lib/models/common-member').createNew();
let productWish = require('../../../lib/models/product-wish').createNew();
let config = user.getConfig();
let router = user.getRouter();
let AV = user.getAV();

let async = require('async');
let extend = require('xtend');

require('../../../lib/utils');

let data = extend(config.data, {
    title:`${config.data.name}用户信息`,
    headerTitle:'用户信息',
    currentPage: 'userinfo'
});


router.get('/add/:productId', (req,res) => {
    let sessionData = req.cookies.login;
    user.isWebUserLogin(req,res);
    let member = user.getDecodeByBase64(sessionData);
    let productId = req.params.productId ? req.params.productId : null;
    if (productId && member.id) {
        productWish.add({'productId':productId,'commonMemberId':member.id}).then(()=>{
            res.send({success:1});
        });
    } else {
        res.send({success:0});
    }
});

//保存userinfo
router.post('/edit/:productId', (req, res) => {
    let sessionData = req.cookies.login;
    user.isWebUserLogin(req,res);
    let member = user.getDecodeByBase64(sessionData);
    let productId = req.params.productId ? req.params.productId : null;
    if (productId && member.id) {
        productWish.edit({'productId':productId,'commonMemberId':member.id,'status':false}).then(()=>{
            res.send({success:1});
        });
    } else {
        res.send({success:0});
    }
});

module.exports = router;