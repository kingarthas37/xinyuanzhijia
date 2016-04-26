'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require("xtend");

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');

//class
let Product = AV.Object.extend('Product');

let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let data = extend(config.data, {
    title: '产品编辑-产品列表',
    currentTag: 'product',
    currentPage: 'product-index'
});


//首页
router.get('/', (req, res) => {

    //if(!req.AV.user) {
    //    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.LIMIT;
    let order = req.query.order || 'desc';

    let category1Id = req.query.category1Id ? parseInt(req.query.category1Id) : '';
    let category2Id = req.query.category2Id ? parseInt(req.query.category2Id) : '';

    let search = req.query['search'] ? req.query['search'].trim() : '';

    data = extend(data,{
        search: search,
        flash: {success: req.flash('success'), error: req.flash('error')},
        user: req.AV.user,
        category1Id:category1Id,
        category2Id:category2Id,
        category1:[],
        category2:[]
    });
    
    AV.Promise.when(
        //获取count
        new AV.Promise(resolve => {

            let query = new AV.Query(Product);

            if (category2Id) {
                query.equalTo('category2Id', category2Id);
            } else if (category1Id) {
                query.equalTo('category1Id', category1Id);
            }
            
            if (search) {
                query.contains('name', search);
            }
            
            query.count().done(count => {
                data = extend(data, {
                    productPager: pager(page, limit, count),
                    productCount: count
                });
                resolve();
            });
            
        }),
        
        //查询当前页所有数据
        new AV.Promise(resolve => {

            let query = new AV.Query(Product);
            query.skip((page - 1) * limit);
            query.limit(limit);

            if (order === 'asc') {
                query.ascending('productId');
            } else {
                query.descending('productId');
            }

            if (category2Id) {
                query.equalTo('category2Id', category2Id);
            } else if (category1Id) {
                query.equalTo('category1Id', category1Id);
            }

            if (search) {
                query.contains('name', search);
            }
            
            query.find().then(items => {
                data = extend(data, {
                    product: items
                });
                resolve();
            });
            
        }),
        
        //查询category1
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductCategory1);
            query.ascending('index');
            
            query.find().then(items => {
                
                data = extend(data, {
                    category1:items
                });
                
                resolve();
            });
            
        }),
        
        //查询categoty2
        new AV.Promise(resolve => {
            
            if(!category1Id) {
                return resolve();
            }

            let query = new AV.Query(ProductCategory2);
            query.equalTo('category1Id',category1Id);
            query.find().then(items => {
                data = extend(data, {
                    category2:items
                });
                resolve();
            });
            
        })
        
    ).then(() => res.render('admin/product', data));

});

module.exports = router;