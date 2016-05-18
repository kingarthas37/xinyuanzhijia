'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require("xtend");

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');

//class
let ProductMethod = AV.Object.extend('ProductMethod');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品类型列表页`,
    currentTag: 'product',
    currentPage: 'product-method'
});

//首页
router.get('/', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.LIMIT;
    let order = req.query.order || 'desc';
    
    let search = req.query['search'] ? req.query['search'].trim() : '';

    data = extend(data,{
        search: search,
        flash: {success: req.flash('success'), error: req.flash('error')},
        user: req.AV.user
    });

    AV.Promise.when(
        
        //获取count
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductMethod);

            if (search) {
                query.contains('name', search);
            }

            query.count().done(count => {
                data = extend(data, {
                    productMethodPager: pager(page, limit, count),
                    productMethodCount: count
                });
                resolve();
            });

        }),

        //查询当前页所有数据
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductMethod);
            query.skip((page - 1) * limit);
            query.limit(limit);

            if (order === 'asc') {
                query.ascending('productId');
            } else {
                query.descending('productId');
            }

            if (search) {
                query.contains('name', search);
            }

            query.find().then(items => {
                data = extend(data, {
                    productMethod:items
                });
                resolve();
            });

        })

    ).then(() => res.render('admin/product-method', data));

});

module.exports = router;