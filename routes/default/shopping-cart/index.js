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
    title:`${config.data.name}我的购物车`,
    headerTitle:'我的购物车',
    currentPage: 'shopping-cart'
});

router.get('/', (req,res) => {
    res.render('default/shopping-cart', data);
});

router.post('/add', (req,res) => {
    let productId = parseInt(req.body['pid']);
    let count = parseInt(req.body['count']);
    shoppingCart.setShoppingCartCookie(req,res,{productId, count}, 60*1000*60*24*365);
    var carts = req.cookies.xcarts;
    console.log(carts);
    res.send({'success':1});
   /* if(req.cookies.login) {
        
        res.send({'success':1});
    } else {
        var carts = req.cookies.xcarts;
        console.log(carts.productId);
        res.send({'success':1});
    }*/
});

module.exports = router;