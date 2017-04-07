'use strict';

let product = require('../../../lib/models/product').createNew();
let productClick = require('../../../lib/models/product-click').createNew();
let productWish = require('../../../lib/models/product-wish').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();
let markdown = require('markdown').markdown;


router.get('/user/:productId', (req, res) => {
    let productId = req.params.productId ? parseInt(req.params.productId) : null;
    let member = req.cookies.login ? product.getDecodeByBase64(req.cookies.login) : null;
    let memberIdArray = new Array();
    let data = [];
    if (!productId) {
        res.send(data);
    }
    AV.Promise.when(
        new AV.Promise(resolve => {
            productClick.getProductClickByProductId(productId, {limit: 9}).then(result => {
                if (result.length > 0) {
                    result.forEach(item => {
                        if (!(memberIdArray.indexOf(item.get('commonMemberId')) >= 0)) {
                            memberIdArray.push(item.get('commonMemberId'));
                        }
                    });
                }
                if (memberIdArray.length > 0) {
                    productClick.getProductIdArrayByMemberIdArray(memberIdArray, productId, 20).then(result => {
                        if(result.length > 0) {
                            product.getProducts({limit:9, page:1,ids: result.toString()}).then(items => {
                                data = extend(data, {items});
                                resolve();
                            });
                        }
                    });
                } else {
                    resolve();
                }

            });
        })
    ).then(() => {
        res.send(data);
    });
});

router.get('/custom/:productIds', (req, res) => {
    let data = [];
    let productIds = req.params.productIds;
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProducts({limit:9, page:1,ids: productIds.toString()}).then(items => {
                data = extend(data, {items});
                resolve();
            });
        })
    ).then(() => {
        res.send(data);
    });
});

module.exports = router;