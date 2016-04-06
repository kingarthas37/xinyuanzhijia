'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require("xtend");

let config = require('../../../lib/config');

//class
let ProductCategory1 = AV.Object.extend('ProductCategory1');
let ProductCategory2 = AV.Object.extend('ProductCategory2');

//lib
let pager = require('../../../lib/component/pager');

let data =  extend(config.data,{
    title: '产品分类列表',
    currentPage: 'product-category'
});


//首页render
router.get('/',(req,res) => {

    //if (!req.AV.user) {
    //    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}
    
    {
        let queryCategory1 = new AV.Query(ProductCategory1);
        let queryCategory2 = new AV.Query(ProductCategory2);
        
        queryCategory1.find().done(items=> {
            data = extend(data,{
                category:items
            });
            return queryCategory2.find();
        }).done(items2 => {

            data.category.forEach(item1 => {
                item1.contents = [];
                items2.forEach( item2 => {
                    if(item1.get('productCategory1Id') === item2.get('productCategory1Id')) {
                        item1.contents.push(item2);
                    }
                });
            });

            return res.render('admin/product-category', data);
        });
        
    }

});



//remove-category-1
router.get('/remove-category-1',(req,res) => {

    let query = new AV.Query(ProductCategory1);
    let productCategory1Id = parseInt(req.query.id);
    
    query.equalTo('productCategory1Id',productCategory1Id);
    
    query.first().done(item => {
        console.info(item);
        
        item.destroy().then(
            ()=> {
                res.send({
                    success:1,
                    message:'删除成功!'
                });
            },
            ()=> {
                res.send({
                    success:0,
                    message:'删除失败!'
                });
            }
        );
    });
    
});



module.exports = router;