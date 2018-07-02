'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');
let markdown = require('markdown').markdown;

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');
var shot = require('../../../lib/component/shot');
let base = require('../../../lib/models/base');

//class
let Product = AV.Object.extend('Product');
let ProductBanner = AV.Object.extend('ProductBanner');
let ProductGroup =AV.Object.extend('ProductGroup');

let ProductMethod = AV.Object.extend('ProductMethod');
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品预览`,
    currentTag: 'product',
    currentPage: 'product-preview',
    watermark:config.watermark
});


//预览产品页
router.get('/:productId',(req,res)=> {

    var productId = parseInt(req.params.productId);
    let productMethodId = parseInt(req.query['product-method-id']);
    
    data = extend(data, {
        user: req.AV.user
    });


    async.series([
        cb => {
            let query = new AV.Query(Product);
            query.equalTo('productId', productId);
            query.first().done(product => {

                let name = product.get('name');
                name = toUpperCase(name);
                
                //水印判断不同淘宝店铺
                let watermark = productMethodId === 21 ? config.watermark.muxue928 : config.watermark.main;
                let detailImage = product.get('detailImage').replace(/ac-QuiPuWpJ.clouddn.com/gi,'lc-QuiPuWpJ.cn-n1.lcfile.com');
                if (/.JPG/.test(detailImage)) {
                    detailImage = detailImage.replace(/\.JPG/gi,'.JPG'+ watermark);
                } else {
                    detailImage = detailImage.replace(/\.jpg/gi,'.jpg'+ watermark);
                }
                data = extend(data,{
                    product,
                    name:markdown.toHTML(name),
                    nameEn:markdown.toHTML(product.get('nameEn')),
                    detail: markdown.toHTML(product.get('detail')),
                    review: markdown.toHTML(product.get('review')),
                    property: markdown.toHTML(product.get('property')),
                    instruction: markdown.toHTML(product.get('instruction')),
                    use: markdown.toHTML(product.get('use')),
                    detailImage: markdown.toHTML(detailImage),
                    groups:JSON.stringify(product.get('groups'))
                });

                cb();

            });
        },
        cb => {
            
            let bannerId = parseInt(data.product.get('bannerId'));
            let query = new AV.Query(ProductBanner);
            query.equalTo('bannerId', bannerId);
            query.first().then(result => {
                data = extend(data,{
                    banner:result
                });
                
                cb();
            });
            
        },
        cb => {
            
            let query = new AV.Query(ProductGroup);
            query.select('productGroupName','productGroupId');
            query.find().then(results=> {
                data = extend(data,{
                    groupsName:JSON.stringify(results)
                });
                cb();
            });
            
        }
    ], () => res.render('admin/product/preview', data));
    
    
});




//编辑时预览产品页
router.post('/quick-preview', function (req, res) {

    base.isAdminUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user: req.AV.user
    });
    
    let name = req.body['name'];
    name = toUpperCase(name);

    let nameEn = req.body['name-en'];
    let banner = req.body['banner'];
    let detail = req.body['detail'];
    let review = req.body['review'];
    let property = req.body['property'];
    let instruction = req.body['instruction'];
    let use = req.body['use'];
    let detailImage = req.body['detail-image'];
    
    let productMethodId = parseInt(req.body['select-product-method']);
    let category1Id = parseInt(req.body['select-category-1']);
    let category2Id = parseInt(req.body['select-category-2']);
    
    data = extend(data,{
        name:name,
        nameEn:nameEn,
        banner:banner,
        detail: markdown.toHTML(detail),
        review: markdown.toHTML(review),
        property: markdown.toHTML(property),
        instruction: markdown.toHTML(instruction),
        use: markdown.toHTML(use),
        detailImage: markdown.toHTML(detailImage)
    });

    async.parallel([
        cb => {
            let query = new AV.Query(ProductMethod);
            query.equalTo('productMethodId',productMethodId);
            query.first().then(item => {
                data = extend(data,{
                    productMethodName:item.get('name')
                });
                cb();
            });
        },
        cb => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('category1Id',category1Id);
            query.first().then(item => {
                data = extend(data,{
                    category1Name:item.get('name')
                });
                cb();
            });
        },
        cb => {
            let query = new AV.Query(ProductCategory2);
            query.equalTo('category2Id',category2Id);
            query.first().then(item => {
                data = extend(data,{
                    category2Name:item.get('name')
                });
                cb();
            });
        }
    ], () => res.render('admin/product/quick-preview', data));
    
});

function imageSet(html) {
    return html.replace(/\.(jpg|jpeg|png)/gi,`.$1${data.watermark.main}`);
}

//shot
router.post('/shot', (req, res) => {

    base.isAdminUserLogin(req, res);  //判断是否登录
    
    let name = req.body.name.substr(0, 20);
    let html = req.body.html;
    let htmlHeight = parseInt(req.body.htmlHeight);
    let segmentHeight = parseInt(req.body.segmentHeight);

    shot({
        name,
        html,
        htmlHeight,
        segmentHeight
    }).then(function() {
        res.json({success:1});
    },function(err) {
        res.send(err);
    });

});

//匹配name大小写,转换
function toUpperCase(name) {
    let reg = /\[([^\]]*)\]/;
    if(reg.test(name)) {
        let str1 = reg.exec(name)[1];
        let str2 = str1.replace(/(?:\s|\b)(\w)/gi,a =>{
            return a.toUpperCase();
        });
        str2 = `[${str2}]`;
        name = name.replace(reg,a=> {
            return str2;
        });
    }
    return name;
}

module.exports = router;