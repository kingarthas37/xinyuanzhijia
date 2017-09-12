'use strict';

let product = require('../../../lib/models/product').createNew();
let productClick = require('../../../lib/models/product-click').createNew();
let productWish = require('../../../lib/models/product-wish').createNew();
let productGroup = require('../../../lib/models/product-group').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();
let markdown = require('markdown').markdown;

let data = extend(config.data, {
    title: `${config.data.name} - 搜索`,
    currentPage: 'detail',
    watermark: config.watermark
});

router.get('/:id', (req, res) => {
    let id = req.params.id ? parseInt(req.params.id) : null;
    let member = req.cookies.login ? product.getDecodeByBase64(req.cookies.login) : null;
    AV.Promise.when(
        new AV.Promise(resolve => {
            product.getProductById(id).then(result => {
                product.updateProductPageViews(result);
                let memberId = member ? member.id : null;
                productClick.setProductClick(memberId, config.productType.normal,result.get('productId'));
                data = extend(data, {'item': result.attributes});
                data.item.createdAt = result.createdAt;
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
        }),
        new AV.Promise(resolve => {
            productGroup.getProductGroup({page:1,limit:10}).then(result => {
                data = extend(data, {'groupsName': JSON.stringify(result.items)});
                resolve();
            });
        })
    ).then(() => {
        if(data.item) {
            data.water = '';
            for (var i = 0; i < data.item.productMethod.length; i++){
                if (data.item.productMethod[i] == 3) {
                    data.water = data.watermark.main;
                    break;
                } else if (data.item.productMethod[i] == 21) {
                    data.water = data.watermark.muxue928;
                    break;
                }
            }
            data.item.detailImage = data.item.detailImage.replace(/\.jpg/gi, '.jpg'+data.water);
            data.item.groups = JSON.stringify(data.item.groups);
            data.item.detail = markdown.toHTML(data.item.detail);
            data.item.property = markdown.toHTML(data.item.property);
            data.item.instruction = markdown.toHTML(data.item.instruction);
            data.item.use = markdown.toHTML(data.item.use);
            data.item.detailImage = markdown.toHTML(data.item.detailImage);
            var date = new Date();
            var seperator = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var currentDate = year + seperator + month + seperator + strDate;
            var onsalDate = data.item.onsaleDate ? data.item.onsaleDate : data.item.createdAt;
            var monthNum = product.getMct(product.formartDate(onsalDate), currentDate, seperator);
            var monthSales = monthNum > 0 ? (data.item.sales / monthNum) : 0;
            if (monthSales < 1) {
                data.item.monthSales = "少于1";
            } else {
                data.item.monthSales = Math.ceil(monthSales);
            }
            res.render('default/product/detail', data);
        } else {
            res.redirect('/error/404');
        }

    });
});

module.exports = router;