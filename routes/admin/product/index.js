'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');

//class
let Product = AV.Object.extend('Product');

let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');
let ProductProperty = AV.Object.extend('ProductProperty');


let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品列表页`,
    currentTag: 'product',
    currentPage: 'product-index'
});

//首页
router.get('/', (req, res) => {

    if (!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let order = req.query.order || 'desc';

    let productMethodId = req.query['product-method-id'] ? parseInt(req.query['product-method-id']) : 0;
    let category1Id = req.query['category1-id'] ? parseInt(req.query['category1-id']) : 0;
    let category2Id = req.query['category2-id'] ? parseInt(req.query['category2-id']) : 0;
    let search = req.query['search'] ? req.query['search'].trim() : '';

    data = extend(data, {
        search,
        flash: {success: req.flash('success'), error: req.flash('error')},
        user: req.AV.user,
        productMethodId,
        category1Id,
        category2Id,
        category1: [],
        category2: []
    });

    AV.Promise.when(
        //获取count
        new AV.Promise(resolve => {

            let query = new AV.Query(Product);

            if(category2Id) {
                query.equalTo('category2', category2Id);
            } else if(category1Id) {
                query.equalTo('category1', category1Id);
            } else if(productMethodId) {
                query.equalTo('productMethod',productMethodId);
            }

            if (search.length) {
                query.contains('name', search);
            }

            query.count().done(count => {
                data = extend(data, {
                    pager: pager.init(page, limit, count),
                    pagerHtml: pager.initHtml({
                        page, limit, count,
                        url: '/admin/product',
                        serialize: {
                            page,search,
                            'product-method-id':productMethodId,
                            'category1-id':category1Id,
                            'category2-id':category2Id
                        }
                    })
                });
                resolve();
            });

        }),

        //查询当前页所有数据
        new AV.Promise(resolve => {

            let query = new AV.Query(Product);
            query.skip((page - 1) * limit);
            query.limit(limit);

            query[order === 'asc' ? 'ascending' : 'descending']('productId');

            if(category2Id) {
                query.equalTo('category2', category2Id);
            } else if(category1Id) {
                query.equalTo('category1', category1Id);
            } else if(productMethodId) {
                query.equalTo('productMethod',productMethodId);
            }

            if (search.length) {
                query.contains('name', search);
            }

            query.find().then(items => {

                items.forEach(n => {
                    n.createdDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.createdAt.getMonth() + 1}/${n.createdAt.getDate()}`;
                    n.updatedDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.updatedAt.getMonth() + 1}/${n.updatedAt.getDate()}`;
                });

                data = extend(data, {
                    product: items
                });
                
                resolve();
                
            });

        }),

        //查询productMethod
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductMethod);
            query.find().then(productMethod => {
                data = extend(data, {productMethod});
                resolve();
            });

        }),
        
        //查询category1
        new AV.Promise(resolve => {

            if(!productMethodId) {
                return resolve();
            }
            
            let query = new AV.Query(ProductCategory1);
            query.equalTo('productMethodId', productMethodId);
            query.find().then(category1 => {
                data = extend(data, {category1});
                resolve();
            });
        }),

        //查询categoty2
        new AV.Promise(resolve => {

            if (!category1Id) {
                return resolve();
            }

            let query = new AV.Query(ProductCategory2);
            query.equalTo('category1Id', category1Id);
            query.find().then(category2 => {
                data = extend(data, {category2});
                resolve();
            });

        })
    ).then(() => res.render('admin/product', data));

});


//删除product
router.post('/remove/:productId',(req,res)=> {
    
    if (!req.AV.user) {
        return res.send({success:0,error:config.errors.UNAUTHORIZED});
    }
    
    let productId = parseInt(req.params.productId);
    
    AV.Promise.when(
       
        new AV.Promise(resolve => {
            
            let query = new AV.Query(Product);
            query.equalTo('productId',productId);
            query.first().then(product => {
                return product.destroy();
            }).then(resolve);
            
        }),

        new AV.Promise(resolve => {

            let query = new AV.Query(ProductProperty);
            query.equalTo('productId',productId);
            query.first().then(product => {
                return product.destroy();
            }).then(resolve);
            
        })
        
    ).then(()=> {
        res.send({
            success:1
        });
    });
    
});


//产品列表首页获取数据
router.get('/list-data',(req,res) => {

    let productListId = req.query.productListId;
    productListId = productListId.map(item => parseInt(item));
    
    let query = new AV.Query(ProductProperty);
    query.containedIn('productId',productListId);
    query.select('productId','purchaseLink');
    
    query.find().then(products => {
        res.send({
            success:1,
            products
        });
    });

});

module.exports = router;