'use strict';

let product = require('../../../lib/models/product-all').createNew();
let productSearchKeywordsHistory = require('../../../lib/models/product-search-history').createNew();
let commonMemberSearchHistory = require('../../../lib/models/common-member-search-history').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();

let data = extend(config.data, {
    title: `${config.data.name} - 搜索`,
    currentPage: 'search-index'
});

//首页
router.get('/', (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let order = req.query.order || 'sales';
    let categoryId = req.query.catid ? parseInt(req.query.catid) : null;
    let keywords = req.query.keywords || null;
    let isHandiwork = req.query.isHandiwork ? parseInt(req.query.isHandiwork) : null;
    let inventory = req.query.inventory ? parseInt(req.query.inventory) :  null;
    let place = req.query.place ? parseInt(req.query.place) : null;
    data = extend(data, {'keywords': keywords, 'catid': categoryId, 'isHandiwork': isHandiwork, 'inventory': inventory});
    if (keywords) {
        let member = req.cookies.login ? product.getDecodeByBase64(req.cookies.login) : null;
        let memberId = member ? member.id : null;
        productSearchKeywordsHistory.setKeywordsHistory(keywords).then(result => {
            if (memberId) {
                commonMemberSearchHistory.setHistory(memberId, keywords, result.id);
            }
        });
    }
    product.getProducts({page, limit, order, keywords, categoryId, isHandiwork, inventory, place}).then(result => {
        data = extend(data, result);
        res.render('default/search', data);
    });

});

module.exports = router;