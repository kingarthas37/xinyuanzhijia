'use strict';

let product = require('../../../lib/models/product-all').createNew();
let productSearchKeywordsHistory = require('../../../lib/models/product-search-history').createNew();
let commonMemberSearchHistory = require('../../../lib/models/common-member-search-history').createNew();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();

//首页
router.get('/', (req, res) => {
    let limit = 5;
    let keywords = req.query.name;
    console.log(keywords);
    let data = new Array();
    product.getProducts({limit, keywords}).then(result => {
        if(result.count > 0) {
            result.items.forEach(item => {
                data.push({"value":item.attributes.name, "productId":item.attributes.productAllId,"image":item.attributes.coverImage});
            });
        }
        res.send(data);
    });
});

module.exports = router;