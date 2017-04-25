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
let base = require('../../../lib/models/base');
let pro = require('../../../lib/models/product').createNew();

let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');
//let ProductProperty = AV.Object.extend('ProductProperty');


let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品列表页`,
    currentTag: 'product',
    currentPage: 'product-index',
    watermark:config.watermark
});

//首页
router.get('/', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let order = req.query.order || 'createdAt';
    let onsale = req.query.onsale ? parseInt(req.query.onsale) : 0;

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
        category2: [],
        mainImage:[],
        onsale
    });

    let options = {search, page, limit, onsale, productMethodId, category1Id, category2Id, order};
    AV.Promise.when(
        //获取count
        new AV.Promise(resolve => {
            pro.getProducts(options, true).then(count => {
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
            pro.getProducts(options, false).then(items => {
                items.forEach(n => {
                    n.createdDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.createdAt.getMonth() + 1}/${n.createdAt.getDate()}`;
                    n.updatedDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.updatedAt.getMonth() + 1}/${n.updatedAt.getDate()}`;

                    let mainImage = n.get('mainImage');
                    if(mainImage) {
                        for(let i in mainImage) {
                            if(!n.mainImage) {
                                n.mainImage = mainImage[i].url;
                            }
                        }
                    }
                });
                data = extend(data, {product: items});
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
            query.ascending('index');
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
            query.ascending('index');
            query.find().then(category2 => {
                data = extend(data, {category2});
                resolve();
            });

        })
    ).then(() => res.render('admin/product', data));

});


//删除product
router.post('/remove/:productId',(req,res)=> {

    base.isAdminUserLogin(req, res);  //判断是否登录
    
    let productId = parseInt(req.params.productId);

    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(product => {
        return product.destroy();
    }).then(()=> {
        res.send({
            success:1
        });
    });
});


//产品列表首页获取数据
router.get('/list-data',(req,res) => {

    let productListId = req.query.productListId;
    productListId = productListId.map(item => parseInt(item));
    
    let query = new AV.Query(Product);
    query.containedIn('productId',productListId);
    query.select('productId','purchaseLink','shopLink','stock');
    
    query.find().then(products => {
        res.send({
            success:1,
            products
        });
    });

});


//typeahead查询产品名称,用于order add/edit页面
router.get('/get-product', (req, res) => {

    let name = req.query['name'];
    let query = new AV.Query(Product);
    query.contains('name', name);
    query.select('name', 'productId', 'mainImage');

    query.find().then(results => {

        let jsonData = [];

        for (let i = 0; i < results.length; i++) {
            let imageArr = [];
            for (let key in results[i].get('mainImage')) {
                imageArr.push(results[i].get('mainImage')[key].url);
            }
            let obj = {
                'value': `${results[i].get('name')} {id:${results[i].get('productId')}}`,
                'productId': results[i].get('productId'),
                'image': imageArr[0] || 'http://ac-JoaBcRTt.clouddn.com/b7f0d580ef9a4ae8e19b.png'
            };
            jsonData.push(obj);
        }
        return res.json(jsonData);

    }, ()=> res.json({success: 0}));

});

//通过productId查询product name
router.get('/get-id/:productId', (req, res) => {

    let productId = parseInt(req.params['productId']);
    let query = new AV.Query(Product);
    
    query.equalTo('productId',productId);
    query.select('name');

    query.first().then(result => {

        res.send({
            success:1,
            result
        });

    },()=>res.json({success: 0}));

});

module.exports = router;