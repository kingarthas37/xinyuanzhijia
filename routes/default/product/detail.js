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

let data = extend(config.data, {
    title: `${config.data.name} - 搜索`,
    currentPage: 'detail'
});

router.get('/:id', (req, res) => {
    let id = req.params.id ? parseInt(req.params.id) : null;
    let member = req.cookies.login ? product.getDecodeByBase64(req.cookies.login) : null;
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProductById(id).then(result => {
                product.updateProductPageViews(result);
                let memberId = member ? member.id : null;
                productClick.setProductClick(memberId, config.productType.all,result.get('productId'));
                data = extend(data, {'item': result.attributes});
                resolve();
            });
        }),
        new AV.Promise(resolve => {
            if (member) {
                productWish.getWishByCommonMemberIdAndProductId(member.id, id).then(result => {
                    data = extend(data, result);
                    resolve();
                });
            } else {
                data = extend(data, {wish:false});
                resolve();
            }

        }),
        new AV.Promise(resolve => {
            productWish.getWishCountByProductId(id).then(result => {
                data = extend(data, {'wishCount': result.count});
                resolve();
            });
        })
    ).then(() => {
        if(data.item) {
            
            data.item.detail = markdown.toHTML(data.item.detail);
            data.item.property = markdown.toHTML(data.item.property);
            data.item.instruction = markdown.toHTML(data.item.instruction);
            data.item.use = markdown.toHTML(data.item.use);
            data.item.detailImage = markdown.toHTML(data.item.detailImage);
            
            res.render('default/product/detail', data);
        } else {
            res.redirect('/error/404');
        }

    });
});

router.get('/groups/:id', (req, res) => {
    let id = req.params.id ? parseInt(req.params.id) : null;
    let ret = {'data': null};
    if (id) {
        product.getProductById(id).then(result => {
            if(result) {
                ret.data = result.attributes;
                res.send(ret);
            }
        });
    } else {
        res.send(ret);
    }
});

module.exports = router;