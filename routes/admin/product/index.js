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
var spider = require('../../../lib/spider');
var https = require('https');

let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');
var isArray = require('util').isArray;
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
    let productTitle = onsale == 1 ? '上架产品列表' : '下架产品列表';

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
        onsale,
        productTitle,
        limit
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

    let search = req.query['name'];
    let page = 1;
    let limit = 500;
    let select = 'name, productId, mainImage';
    let options = {search, page, limit, select};
    pro.getProducts(options, false).then(results => {
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
    },()=>res.json({success: 0}));
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

router.post('/product-copy', (req, res) => {
    let productId = parseInt(req.body['productId']);
    let fields = req.body['field[]'];
    let success = [];
    pro.getProductById(productId).then(result => {
        let values = [];
        if(isArray(fields)) {
            for (var i = 0; i < fields.length; i++){
                values[i] = result.attributes[fields[i]];
            }
        } else {
            values[0] = result.attributes[fields];
        }
        pro.getProductsByCategoryId(result.attributes.category2).then(items => {
            async.forEach(items, function(item, callback){
                if (item.attributes.productId != productId) {
                    if(isArray(fields)) {
                        for (var i = 0; i < fields.length; i++) {
                            item.set(fields[i], values[i]);
                        }
                    } else {
                        item.set(fields, values[0]);
                    }
                    item.save().then(()=> {
                        success.push(item.attributes.productId);
                        callback();
                    });
                } else {
                    callback();
                }
            }, function(err){
                if(err) {
                    console.log('product copy:' + err);
                }
                res.send({success:success, count:success.length});
            });
        });
    });
});

router.get('/spider-info', (req, res) => {
    let url = req.query.url;
    let productId = parseInt(req.query['product-id']);
    var domain = "www.etsy.com";
    var result = [];
    var response = res;
    var spiderConfig = spider.spider;
    var code = 0;
    var message = '';
    https.get(url, function(res) {
        var html='';
        var response_timer = setTimeout(function() {
            res.destroy();
            message = '爬虫超时';
            response.send({code, message})
        }, 90000);
        res.on('data', function(data) {
            html += data;
        });
        res.on('end',function() {
            clearTimeout(response_timer);
            /*var fs = require('fs');
            var file = '1.html';
            fs.appendFile(file, html, function(err) {

            });*/
            var price = html.match(spiderConfig[domain]['price']);
            if(price) {
                result['price'] = price[0].replace(spiderConfig[domain]['replacePrice'], "");
            }
            var title = html.match(spiderConfig[domain]['title']);
            if(title) {
                result['title'] = title[0].replace(spiderConfig[domain]['replaceTag'], "");
            }
            var image = html.match(spiderConfig[domain]['image']);
            if(image) {
                for(var i = 0; i < image.length; i++){
                    image[i] = spiderConfig[domain]['path'] + image[i].match(spiderConfig[domain]['imageUrl'])[0].replace(/"/gi, "");
                }
                result['image'] = image;
            }
            var overView = html.match(spiderConfig[domain]['overView']);
            if(overView) {
                result['overView'] = overView[0].replace(spiderConfig[domain]['replaceTag'], "  ").trim();
            }
            var description = html.match(spiderConfig[domain]['description']);
            if(description) {
                result['description'] = description[0].replace(spiderConfig[domain]['replaceTag'], "").trim();
            }
            if (result['price']) {
                async.waterfall([
                    cb => {
                        let query = new AV.Query(Product);
                        query.equalTo('productId', productId);
                        query.first().done(product => {
                            cb(null,product);
                        });
                    },
                    (product,cb) => {
                        var mainImage = {1:{url:result['image'][0], isMainImage:true}};
                        product.set('name', result['title']);
                        product.set('detail', result['description']);
                        product.set('mainImage', mainImage);
                        product.set('property', result['overView']);
                        product.set('originalPrice', result['price']);
                        product.set('nameEn', result['title']);
                        product.set('imageSource', result['image'].toString().replace(/,/g, '\n'));
                        product.set('purchaseLink', [url]);
                        product.save().then(() => {
                            code = 1;
                            cb();
                        });
                    }
                ], function (err, values) {
                    response.send({code, message});
                });
            } else {
                message = '页面解析错误';
                response.send({code, message});
            }
            response.send({code, message});
        });
    }).on('error', function() {
        message = 'http get请求失败';
        response.send({code, message});
    });
});

module.exports = router;