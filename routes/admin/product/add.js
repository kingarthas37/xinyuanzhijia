'use strict';

var router = require('express').Router();
var AV = require('leanengine');

var flash = require('connect-flash');

var extend = require("xtend");

var config = require('../../../lib/config');
var utils = require('../../../lib/utils');

//class
var Product = AV.Object.extend('Product');
//var ProductHistory = AV.Object.extend('ProductHistory');
var ProductCategory1 = AV.Object.extend('ProductCategory1');
var ProductCategory2 = AV.Object.extend('ProductCategory2');
var Banner = AV.Object.extend('ProductBanner');


var data = extend(config.data,{
    title:'产品编辑-添加产品',
    currentPage:'product'
});


router.get('/',(req,res) => {

    //if(!req.AV.user) {
    //    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}
    
    data = extend(data,{
        flash:{success:req.flash('success'), error:req.flash('error')},
        user:req.AV.user
    });

    let query1 = new AV.Query(ProductCategory1);
    query1.find().done(items => {
        
        data = extend(data, {
            category1:items
        });

        let query2 = new AV.Query(Banner);
        return query2.find();
        
    }).done(items => {
        data = extend(data, {
            banner: items
        });
        res.render('admin/product/add', data);
    });
    
});


router.post('/',(req,res) => {

    //if(!req.AV.user) {
      //  return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}

    let name = req.body['name'];
    let nameEn = req.body['name-en'];
    let mainImage = req.body['main-image'];
    let category1Id = parseInt(req.body['select-category-1']);
    let category2Id = parseInt(req.body['select-category-2']);
    let banner = req.body['banner'];
    let detail = req.body['detail'];
    let detailEn = req.body['detail-en'];
    let description = req.body['description'];
    let review = req.body['review'];
    let property = req.body['property'];
    let propertyEn = req.body['property-en'];
    let instruction = req.body['instruction'];
    let instructionEn = req.body['instruction-en'];
    let use = req.body['use'];
    let useEn = req.body['use-en'];
    let image = req.body['image'];
    let video = req.body['video'];
    
    let product = new Product();

    console.info(req.body['select-category-2']);

    product.set('name',name);
    product.set('nameEn',name);
    product.set('mainImage',mainImage);
    product.set('category1Id',category1Id);
    product.set('category2Id',category2Id);
    product.set('banner',banner);
    product.set('detail',detail);
    product.set('detailEn',detailEn);
    product.set('description',description);
    product.set('review',review);
    product.set('property',property);
    product.set('propertyEn',propertyEn);
    product.set('instruction',instruction);
    product.set('instructionEn',instructionEn);
    product.set('use',use);
    product.set('useEn',useEn);
    product.set('image',image);
    product.set('video',video);
 
    product.save().done(()=>{
        req.flash('success', '添加商品成功!');
        res.redirect('/admin/product');
    });
    
});

module.exports = router;