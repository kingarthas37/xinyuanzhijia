'use strict';

let product = require('../../../lib/models/product').createNew();
let productSearchKeywordsHistory = require('../../../lib/models/product-search-history').createNew();
let commonMemberSearchHistory = require('../../../lib/models/common-member-search-history').createNew();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let AV = product.getAV();

//首页
router.get('/', (req, res) => {
    let limit = 5;
    let keywords = req.query.name;
    let data = new Array();
    let productMethodId = req.query.method || null;
    let order = 'pageViews';
    let options = {limit, 'search':keywords, productMethodId, order};
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProducts(options).then(result => {
                result.forEach(item => {
                    var image = null;
                    var mainImage = item.get('mainImage');
                    for(var n in mainImage) {
                        if (mainImage[n].isMainImage) {
                            image = mainImage[n].url;
                            break;
                        }
                    }
                    data.push({"value":item.get('name'), "productId":item.get('productId'),"image":image});
                });
                resolve();
            });
        })
    ).then(() => {
        res.send(data);
    });
});

module.exports = router;