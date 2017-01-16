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

    data = extend(data, {
        user: req.AV.user
    });
    
    let query = new AV.Query(Product);
    query.equalTo('productId', productId);
    query.first().done(product => {

        let name = product.get('name');
        name = toUpperCase(name);
        
        data = extend(data,{
            name:markdown.toHTML(name),
            nameEn:markdown.toHTML(product.get('nameEn')),
            detail: markdown.toHTML(product.get('detail')),
            review: markdown.toHTML(product.get('review')),
            property: markdown.toHTML(product.get('property')),
            instruction: markdown.toHTML(product.get('instruction')),
            use: markdown.toHTML(product.get('use')),
            detailImage: markdown.toHTML(product.get('detailImage'))
        });

        res.render('admin/product/preview-web', data);
        
    });
    
});




//编辑时预览产品页
router.post('/preview-taobao', function (req, res) {

    base.isUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user: req.AV.user
    });
    
    let name = req.body['name'];
    name = toUpperCase(name);

    let nameEn = req.body['name-en'];
    let banner = req.body['banner'];
    let detail = req.body['detail'];
    let detailEn = req.body['detail-en'];
    let review = req.body['review'];
    let property = req.body['property'];
    let propertyEn = req.body['property-en'];
    let instruction = req.body['instruction'];
    let instructionEn = req.body['instruction-en'];
    let use = req.body['use'];
    let useEn = req.body['use-en'];
    let detailImage = req.body['detail-image'];
    
    let productMethodId = parseInt(req.body['select-product-method']);
    let category1Id = parseInt(req.body['select-category-1']);
    let category2Id = parseInt(req.body['select-category-2']);

    data = extend(data,{
        name:name,
        nameEn:nameEn,
        banner:banner,
        detail: imageSet(markdown.toHTML(detail)),
        detailEn: imageSet(markdown.toHTML(detailEn)),
        review: markdown.toHTML(review),
        property: imageSet(markdown.toHTML(property)),
        propertyEn: imageSet(markdown.toHTML(propertyEn)),
        instruction: imageSet(markdown.toHTML(instruction)),
        instructionEn: imageSet(markdown.toHTML(instructionEn)),
        use: imageSet(markdown.toHTML(use)),
        useEn: imageSet(markdown.toHTML(useEn)),
        detailImage: imageSet(markdown.toHTML(detailImage))
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
    ], () => res.render('admin/product/preview-taobao', data));
    
});

function imageSet(html) {
    return html.replace(/\.(jpg|jpeg|png)/gi,`.$1${data.watermark.main}`);
}

//shot
router.post('/shot', (req, res) => {

    base.isUserLogin(req, res);  //判断是否登录
    
    let name = req.body.name.substr(0, 20);
    let html = req.body.html;
    let htmlHeight = parseInt(req.body.htmlHeight);

    shot({
        name:name,
        html:html,
        htmlHeight:htmlHeight
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