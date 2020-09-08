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
let orderTrack = require('../../../lib/models/order-track');
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
    let limit = req.query.limit ? parseInt(req.query.limit) : 60;
    let order = req.query.order;
    let onsale = req.query.onsale ? parseInt(req.query.onsale) : 0;

    let productMethodId = req.query['product-method-id'] ? parseInt(req.query['product-method-id']) : 0;
    let category1Id = req.query['category1-id'] ? parseInt(req.query['category1-id']) : 0;
    let category2Id = req.query['category2-id'] ? parseInt(req.query['category2-id']) : 0;
    let search = req.query['search'] ? req.query['search'].trim() : '';
    let productTitle = onsale == 1 ? '上架产品列表' : '下架产品列表';
    let isShortStock = req.query['is-short-stock'] ? (req.query['is-short-stock'] == 'true' ? true : '') : '';
    let isUpdateStock = req.query['is-update-stock'] ? req.query['is-update-stock'] : '';
    let updateStockDate = req.query['update-stock-date'] ? req.query['update-stock-date'] : '';
    let adminStock = req.query['stock'] || '';
    let hot = req.query['hot'] || '';
    let isTranslation = req.query['is-translation'] ? (req.query['is-translation'] == 'true' ? true : '') : '';
    let isSales = req.query['is-sales'] || '';
    let parentProductId = req.query['parent-product-id'] ? parseInt(req.query['parent-product-id']) : '';
    let colorTag = req.query['color-tag'] ? parseInt(req.query['color-tag']) : '';
    if ((isShortStock || updateStockDate || adminStock || isUpdateStock) && !order) {
        order = 'updatedAt';
    } else if (!order) {
        order = 'createdAt';
    }
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
        limit,
        isShortStock,
        isUpdateStock,
        updateStockDate,
        adminStock,
        order,
        hot,
        isTranslation,
        parentProductId,
        isSales,
        colorTag
    });

    let options = {search, page, limit, onsale, productMethodId, category1Id, category2Id, order, isShortStock, isUpdateStock, updateStockDate, adminStock, hot, isTranslation, parentProductId, isSales, colorTag};
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
                            page,
                            search,
                            'product-method-id':productMethodId,
                            'category1-id':category1Id,
                            'category2-id':category2Id,
                            onsale,
                            'is-short-stock':isShortStock,
                            'is-update-stock':isUpdateStock,
                            'update-stock-date':updateStockDate,
                            'stock':adminStock,
                            order,
                            hot,
                            'is-translation': isTranslation,
                            parentProductId,
                            'is-sales':isSales,
                            'color-tag':colorTag
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
                    if(!n.get('offlineTag')) {
                        n.set('offlineTag', {'updateTotaobaoImage':0,'updateTotaobaoTitle':0,'updateTotaobaoContent':0});
                    }
                });
                data = extend(data, {product: items});
                resolve();
            });
        }),

        //查询productMethod
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductMethod);
            query.ascending('index');
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

        }),

        new AV.Promise(resolve => {
            let query = new AV.Query(Product);
            query.select('colorTag');
            query.descending('colorTag');
            query.first().then(color => {
                data = extend(data, {colorTag:color.get('colorTag')});
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
            async.forEachLimit(items, 5, function(item, callback){
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

router.post('/set-onsale/:productId',(req,res)=> {

    let productId = parseInt(req.params['productId']);
    let isOnsale = req.body['isOnsale'] === 'true' ? true : false;
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {
        
        result.set('isOnsale', isOnsale);
        if (isOnsale) {
            result.set('onsaleDate', new Date());
        }
        return result.save();
    }).then(result => {
        res.send({
            success:1
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
            if (result['title']) {
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
        });
    }).on('error', function() {
        message = 'http get请求失败';
        response.send({code, message});
    });
});

router.post('/set-hot/:productId',(req,res)=> {

    let productId = parseInt(req.params['productId']);
    let isHot = req.body['isHot'] === 'true' ? true : false;
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {

        result.set('isHot', isHot);
        return result.save();
    }).then(result => {
        res.send({
            success:1
        });
    });

});

router.post('/set-short-stock/:productId',(req,res)=> {

    let productId = parseInt(req.params['productId']);
    let isShortStock = req.body['isShortStock'] === 'true' ? true : false;
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {

        result.set('isShortStock', isShortStock);
        return result.save();
    }).then(result => {
        res.send({
            success:1
        });
    });

});

router.get('/get-sales', (req, res) => {
    let productIds = req.query['product-ids'];
    let nowDate = new Date();

    //上个月第一天
    let lastMonthFirstDay = new Date();
    lastMonthFirstDay.setMonth(lastMonthFirstDay.getMonth()-1);
    lastMonthFirstDay.setDate(1);

    //上个月最后一天
    let lastMonthLastDay = new Date();
    nowDate.setDate(1);
    lastMonthLastDay.setDate((nowDate.getDate() - 1));

    //上两个月第一天
    let twoMonthFirstDay = new Date();
    twoMonthFirstDay.setMonth(twoMonthFirstDay.getMonth()-2);
    twoMonthFirstDay.setDate(1);

    nowDate = new Date();
    let thirtyDate = new Date(nowDate.setDate(nowDate.getDate() - 30));
    let startDate = twoMonthFirstDay;
    let ninetyDate = new Date(nowDate.setDate(nowDate.getDate() - 60));

    var items = [];
    async.forEachLimit(productIds, 5, function(productId, callback) {
        orderTrack.getOrderByProductIds([productId], startDate).then(result => {
            var data = {'thirty':0,'ninety':0,'productId':productId, 'lastMonty':0, 'twoMonty':0};
            if (result) {
                result.forEach(n => {
                    var pid = n.get('productId');
                    var shippingCounts = n.get('shippingCount');
                    for (var k = 0; k < pid.length; k++) {
                        if (pid[k] == productId) {
                            if (n.createdAt >= twoMonthFirstDay && n.createdAt < lastMonthFirstDay) {
                                data.twoMonty += shippingCounts[k];
                            }
                            if (n.createdAt >= lastMonthFirstDay && n.createdAt <= lastMonthLastDay) {
                                data.lastMonty += shippingCounts[k];
                            }
                            if (n.createdAt >= ninetyDate) {
                                data.ninety += shippingCounts[k];
                            }
                            if (n.createdAt >=  thirtyDate) {
                                data.thirty += shippingCounts[k];
                            }
                        }
                    }
                });
            }
            items.push(data);
            callback();
        });
    }, function(err){
        if(err) {
            console.log('product get sales:' + err);
        }
        res.send({data:items});
    });
});

router.post('/set-update-stock/:productId',(req,res)=> {
    let productId = parseInt(req.params['productId']);
    let isUpdateStock = req.body['isUpdateStock'] === 'true' ? true : false;
    let updateTotaobaoImage = req.body['updateTotaobaoImage'] === 'true' ? 1 : 0;
    let updateTotaobaoTitle = req.body['updateTotaobaoTitle'] === 'true' ? 1 : 0;
    let updateTotaobaoContent = req.body['updateTotaobaoContent'] === 'true' ? 1 : 0;
    let updateTotaobaoPrice = req.body['updateTotaobaoPrice'] === 'true' ? 1 : 0;
    let updateTotaobaoCategory = req.body['updateTotaobaoCategory'] === 'true' ? 1 : 0;
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {
        result.set('isUpdateStock', isUpdateStock);
    result.set('offlineTag',{updateTotaobaoImage,updateTotaobaoTitle,updateTotaobaoContent,updateTotaobaoPrice, updateTotaobaoCategory});
    return result.save();
    }).then(result => {
        res.send({
            success:1
        });
    });
});

router.post('/set-update-stock-date/:productId',(req,res)=> {
    let productId = parseInt(req.params['productId']);
    let updateStockDate = req.body['updateStockDate'] === 'true' ? true : false;
    if (updateStockDate) {
        let query = new AV.Query(Product);
        query.equalTo('productId',productId);
        query.first().then(result => {
            result.set('updateStockDate', 1);
            return result.save();
        }).then(result => {
            res.send({
                success:1
            });
        });
    } else {
        res.send({
            success:1
        });
    }
});

router.post('/set-is-translation/:productId',(req,res)=> {
    let productId = parseInt(req.params['productId']);
    let isTranslation = req.body['isTranslation'] === 'true' ? true : false;
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {
        result.set('isTranslation', isTranslation);
        return result.save();
    }).then(result => {
        res.send({
            success:1
        });
    });
});

router.post('/sync-price',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let price = parseFloat(req.body['price']);
    let category2Id = parseInt(req.body['category2Id']);
    let success = [];
    pro.getProductsByCategoryId([category2Id]).then(items => {
        async.forEachLimit(items,5, function(item, callback){
            item.set('price', price);
            item.save().then(()=> {
                success.push(item.attributes.productId);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('product sync price:' + err);
            }
            res.send({success:success, count:success.length});
        });
    });
});

router.post('/sync-cost-price',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let price = parseFloat(req.body['costPrice']);
    let category2Id = parseInt(req.body['category2Id']);
    let success = [];
    pro.getProductsByCategoryId([category2Id]).then(items => {
        async.forEachLimit(items,5, function(item, callback){
            item.set('costPrice', price);
            item.save().then(()=> {
                success.push(item.attributes.productId);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('product sync cost price:' + err);
            }
            res.send({success:success, count:success.length});
        });
    });
});

router.post('/sync-wholesale-price',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let price = parseFloat(req.body['wholesalePrice']);
    let category2Id = parseInt(req.body['category2Id']);
    let success = [];
    pro.getProductsByCategoryId([category2Id]).then(items => {
        async.forEachLimit(items,5, function(item, callback){
            item.set('wholesalePrice', price);
            item.save().then(()=> {
                success.push(item.attributes.productId);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('product sync wholesale price:' + err);
            }
            res.send({success:success, count:success.length});
        });
    });
});

router.post('/set-binding-product',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let bindingId = parseInt(req.body['bindingId']);
    let bindingNumber = parseInt(req.body['bindingNumber']);
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {
        result.set('bindingId', bindingId);
        result.set('bindingNumber', bindingNumber);
        return result.save();
    }).then(result => {
        res.send({
            success:1
        });
    });
});

router.post('/set-parent-product', (req,res) => {
    let productId = parseInt(req.body['productId']);
    req.body['parentProductId'] = req.body['parentProductId'] || 0;
    let parentProductId = parseInt(req.body['parentProductId']);
    async.auto({
        setParentProductId(resolve) {
            pro.getProductById(productId).then(item => {
                if (parentProductId == 0) {
                    let pid = item.get('parentProductId');
                    if (item.get('isParent') == false) {        //非主产品才能绑定
                        item.set('parentProductId', parentProductId);
                        item.save().then(() => {
                            pro.getProducts({parentProductId:pid}, true).then(count => {
                                if (count > 1) {
                                    resolve();
                                } else {
                                    pro.getProductById(pid).then(item => {
                                        item.set('isParent', false);
                                        item.save();
                                        resolve();
                                    });
                                }

                            });
                        });
                    } else {
                        resolve();
                    }
                } else {
                    if (item.get('isParent') == false) {        //非主产品才能绑定
                        item.set('parentProductId', parentProductId);
                        item.save();
                        resolve();
                    } else {
                        resolve();
                    }
                }
            });
        },
        setIsParent(resolve) {
            if (parentProductId != 0) {
                pro.getProductById(parentProductId).then(item => {
                    item.set('isParent', true);
                    item.save();
                    resolve();
                });
            } else {
                resolve();
            }
        }
    }, (err,results) => res.send({success:1}));
});

router.get('/check-wisdom-products-stock', (req, res) => {
    let url = req.query['url'];
    let productId = parseInt(req.query['productId']) || 0;
    var response = res;
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
            if (html.match(/id="add_to_cart"/gi)) {
                message = '有货';
            } else if (html.match(/id="out_of_stock"/gi)) {
                message = '缺货';
            } else if(html.search('class="add_cart"') >= 0) {
                message = '有货';
            } else if (html.search('class="add_cart"') >= 0 && html.search('class="add_cart"') < html.search('class="out-of-stock"')) {     //判断出现的位置
                message = '有货';
            } else if(html.search('class="add_cart"') < 0 || html.search('class="add_cart"') > html.search('class="out-of-stock"')) {      //判断出现的位置
                message = '缺货';
            } else {
                message = '页面解析错误';
            }
            response.send({code, message});
        });
    }).on('error', function() {
        message = 'http get请求失败';
        response.send({code, message});
    });

});

router.post('/set-is-sales/:productId',(req,res)=> {
    let productId = parseInt(req.params['productId']);
    let isSales = parseInt(req.body['state']);
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.first().then(result => {
        result.set('isSales', isSales);
        return result.save();
    }).then(result => {
        res.send({
            success:1
        });
    });
});

router.post('/set-stock/:productId', (req,res) => {
    let productId = parseInt(req.params['productId']) || 0;
    let isStock = req.body['isStock'] === 'true' ? true : false;
    if (productId>0) {
        let query = new AV.Query(Product);
        query.equalTo('productId',productId);
        query.first().then(result => {
            result.set('isStock', isStock);
            return result.save();
        }).then(result => {
            res.send({
                success:1
            });
        });
    } else {
        res.send({success:0, data:'ID错误'});
    }
});

router.post('/set-discount',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let discount = parseFloat(req.body['discount']);
    let query = new AV.Query(Product);

    query.equalTo('productId',productId);
    query.select('discount');
    query.first().then(result => {
        result.set('discount', discount);
        result.save().then(()=>{
            res.send({
                success:1
            });
        });
    });
});

router.post('/set-category-discount',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let discount = parseFloat(req.body['discount']);
    let category2Id = parseInt(req.body['category2Id']);
    let success = [];
    pro.getProductsByCategoryId([category2Id]).then(items => {
        async.forEachLimit(items,5, function(item, callback){
            item.set('discount', discount);
            item.save().then(()=> {
                success.push(item.attributes.productId);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('set category discount:' + err);
            }
            res.send({success:success, count:success.length});
        });
    });
});

router.post('/set-maximum',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let maximum = parseFloat(req.body['maximum']);
    let query = new AV.Query(Product);

    query.equalTo('productId',productId);
    query.select('maximum');
    query.first().then(result => {
        result.set('maximum', maximum);
        result.save().then(()=>{
            res.send({
                success:1
            });
        });
    });
});

router.post('/set-category-maximum',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let maximum = parseFloat(req.body['maximum']);
    let category2Id = parseInt(req.body['category2Id']);
    let success = [];
    pro.getProductsByCategoryId([category2Id]).then(items => {
        async.forEachLimit(items,5, function(item, callback){
            item.set('maximum', maximum);
            item.save().then(()=> {
                success.push(item.attributes.productId);
                callback();
            });
        }, function(err){
            if(err) {
                console.log('set category maximum:' + err);
            }
            res.send({success:success, count:success.length});
        });
    });
});

router.post('/set-color-tag',(req,res)=> {
    let productId = parseInt(req.body['productId']);
    let colorTag = parseFloat(req.body['colorTag']);
    let query = new AV.Query(Product);

    query.equalTo('productId',productId);
    query.select('colorTag');
    query.first().then(result => {
        result.set('colorTag', colorTag);
        result.save().then(()=>{
            res.send({
                success:1
            });
        });
    });
});

router.get('/get-binding-product/:productId', function (req, res) {
    let productId = parseInt(req.params.productId);
    let query = new AV.Query(Product);
    query.equalTo('productId',productId);
    query.select('bindingId,bindingNumber');
    query.first().then(result => {
        console.log(result);
        res.send({
            bindingId:result.get('bindingId'),
            bindingNumber:result.get('bindingNumber')
        });
    });
});

router.get('/get-color-tag', function (req, res) {
    let query = new AV.Query(Product);
    query.select('colorTag');
    query.descending('colorTag');
    query.first().then(result => {
        res.send({
            colorTag:result.get('colorTag')
        });
    });
});


module.exports = router;