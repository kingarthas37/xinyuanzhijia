'use strict';

let user = require('../../../lib/models/common-member').createNew();
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


    // console.log('/Users/Ebates/Desktop/chamWork/H5/xinyuanzhijia/routes/default/index/home.js 开始画 首页')

    res.render('default/index/index',data);

});

module.exports = router;