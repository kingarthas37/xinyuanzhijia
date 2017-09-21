'use strict';

let product = require('../../../lib/models/product').createNew();
let productSearchKeywordsHistory = require('../../../lib/models/product-search-history').createNew();
let commonMemberSearchHistory = require('../../../lib/models/common-member-search-history').createNew();
let productMethod = require('../../../lib/models/product-method').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();
let markdown = require('markdown').markdown;
let productCategory1 = require('../../../lib/models/product-category1').createNew();
let productCategory2 = require('../../../lib/models/product-category2').createNew();

let data = extend(config.data, {
    title: `${config.data.name} - 产品列表`,
    headerTitle:'产品列表',
    currentPage: 'product',
    pageType: 'product'
});

//首页
router.get('/', (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let keywords = req.query.keywords || '';
    let order = req.query.order || 'onsaleDate';
    let category1Id = req.query.cat1 || '';
    let category2Id = req.query.cat2 || '';
    let productMethodId = req.query.method || '';
    let price = req.query.price || '';
    let stock = req.query.stock || '';
    let onsale = 1;
    let sortTitle = '智能排序';
    if (order == 'stock') {
        sortTitle = '现货';
    } else if (order == 'pageViews') {
        sortTitle = '热门';
    } else if (order == 'sales') {
        sortTitle = '销量';
    } else if (price == 'asc') {
        sortTitle = '价格低-高';
    } else if (price == 'desc') {
        sortTitle = '价格高-低';
    } else {
        sortTitle = '上架时间';
    }
    let path = '';
    if (keywords) {
        path += '&keywords='+keywords;
    }
    if (category1Id) {
        path += '&cat1='+category1Id;
    }
    if (category2Id) {
        path += '&cat2='+category2Id;
    }
    if (productMethodId) {
        path += '&method='+productMethodId;
    }
    if (stock) {
        path += '&stock='+stock;
    }
    data = extend(data,
        {'keywords': keywords,
            'order': order,
            'stock': stock,
            'category1': null,
            'category2': null,
            'count':0,
            'items':null,
            'cat1':category1Id,
            'cat2':category2Id,
            'price':price,
            'sortTitle' : sortTitle,
            'category1Name': '产品一级分类',
            'category2Name': '产品二级分类',
            'method': productMethodId,
            'path': path
        });
    if (keywords) {
        let member = req.cookies.login ? product.getDecodeByBase64(req.cookies.login) : null;
        let memberId = member ? member.id : null;
        productSearchKeywordsHistory.setKeywordsHistory(keywords).then(result => {
            if (memberId) {
                commonMemberSearchHistory.setHistory(memberId, keywords, result.id);
            }
        });
    }
    let options = {onsale, page, limit, 'search':keywords, category1Id, category2Id, productMethodId, stock, order, price};
    AV.Promise.when(
        new AV.Promise(resolve => {
            productCategory1.getProductCategorys({productMethodId}).then(result => {
                data = extend(data, {'category1' : result});
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            if (category1Id) {
                productCategory2.getProductCategorys({category1Id}).then(result => {
                    data = extend(data, {'category2': result});
                    resolve();
                });
            } else {
                resolve();
            }
        }),
        new AV.Promise(resolve => {
            product.getProducts(options).then(result => {
                let nowDate = new Date();

                result.forEach(n => {
                    n.set('isNewSale', false);
                    if (n.get('onsaleDate')) {
                        let saleDate = n.get('onsaleDate');
                        saleDate.setMonth(saleDate.getMonth() + 2);
                        n.set('isNewSale', (saleDate > new Date()));
                    }
                });
                data = extend(data, {items: result});
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            product.getProducts(options, true).then(result => {
                data = extend(data, {count: result});
                resolve();
            });
        })
    ).then(() => {
        res.render('default/product', data);
    });

});

router.get('/ajax', (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let keywords = req.query.keywords || null;
    let order = req.query.order || 'onsaleDate';
    let stock = req.query.stock || null;
    let category1Id = req.query.cat1 || null;
    let category2Id = req.query.cat2 || null;
    let productMethodId = req.query.method || null;
    let price = req.query.price || null;
    let onsale = 1;
    let options = {onsale, page, limit, 'search':keywords, category1Id, category2Id, productMethodId, stock, order, price};
    let datas = {'items': null};
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProducts(options).then(result => {
                let nowDate = new Date();

                result.forEach(n => {
                    n.set('isNewSale', false);
                    if (n.get('onsaleDate')) {
                        let saleDate = n.get('onsaleDate');
                        saleDate.setMonth(saleDate.getMonth() + 2);
                        n.set('isNewSale', (saleDate > new Date()));
                    }
                });
                datas.items = result;
                resolve();
            });
        })
    ).then(() => {
        res.send(datas);
    });

});

router.get('/products-id/:productIds', (req, res) => {
    let productIds = req.params.productIds;
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProducts({limit:9, page:1,ids: productIds.toString(), select:'name,mainImage,productId'}).then(items => {
                data = extend(data, {items});
                resolve();
            });
        })
    ).then(() => {
        res.send(data);
    });
});

module.exports = router;