'use strict';

let product = require('../../../lib/models/product').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();
let markdown = require('markdown').markdown;


router.get('/approval/:productId', (req, res) => {
    let productId = req.params.productId ? parseInt(req.params.productId) : null;
    let data = {success:0};
    if (productId) {
        product.updateProductApprovalByProductId(productId);
        data = {success:1};
    }
    res.send(data);
});

router.get('/share/:productId', (req, res) => {
    let productId = req.params.productId ? parseInt(req.params.productId) : null;
    let data = {success:0};
    if (productId) {
        product.updateProductShareByProductId(productId);
        data = {success:1};
    }
    res.send(data);
});

module.exports = router;