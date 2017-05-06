'use strict';

let product = require('../../../lib/models/product').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();
let markdown = require('markdown').markdown;

let data = extend(config.data, {
    title: `${config.data.name} - 产品`,
    currentPage: 'product'
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