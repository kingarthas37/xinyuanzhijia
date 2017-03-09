'use strict';

let product = require('../../../lib/models/product').createNew();
let productSearchKeywordsHistory = require('../../../lib/models/product-search-history').createNew();
let commonMemberSearchHistory = require('../../../lib/models/common-member-search-history').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();
let productCategory1 = require('../../../lib/models/product-category1').createNew();
let productCategory2 = require('../../../lib/models/product-category2').createNew();

let data = extend(config.data, {
    title: `${config.data.name} - 搜索`,
    headerTitle:'搜索',
    currentPage: 'search-index'
});

//首页
router.get('/', (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let keywords = req.query.keywords || null;
    let stock = req.query.stock || null;
    let order = req.query.order || 'createdAt';
    let category1Id = req.query.cat1 || null;
    let category2Id = req.query.cat2 || null;
    let productMethodId = req.query.method || null;
    let price = req.query.price || null;
    let onsale = 1;
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
            'price':price
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
        res.render('default/search', data);
    });



});

module.exports = router;