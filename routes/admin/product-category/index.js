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

let data = extend(config.data, {
    title: '产品分类列表',
    currentPage: 'product-category'
});


//首页render
router.get('/', (req, res) => {

    //if (!req.AV.user) {
    //    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}

    {
        let query1 = new AV.Query(ProductCategory1);
        let query2 = new AV.Query(ProductCategory2);

        query1.ascending('index');
        query1.find().done(items=> {

            data = extend(data, {
                category: items
            });

            query2.ascending('index');
            return query2.find();
        }).done(items2 => {

            data.category.forEach(item1 => {
                item1.contents = [];
                items2.forEach(item2 => {
                    if (item1.get('productCategory1Id') === item2.get('productCategory1Id')) {
                        item1.contents.push(item2);
                    }
                });
            });

            return res.render('admin/product-category', data);
        });

    }

});


//remove-category-1
router.get('/remove-category-1', (req, res) => {

    let query = new AV.Query(ProductCategory1);
    let productCategory1Id = parseInt(req.query.id);

    query.equalTo('productCategory1Id', productCategory1Id);

    query.first().done(item => {

        item.destroy().done(()=> {
            
            let query = new AV.Query(ProductCategory1);
            query.ascending('index');
            return query.find();
            
        }).done(items=> {
            //批量更新index
            let promises = [];
            items.forEach((item, i) => {
                item.set('index', i);
                promises.push(item.save());
            });
            return AV.Promise.when(promises);

        }).done(()=>res.send({success: 1, message: '删除成功!'}));
    });
});


//move-category-1-up
router.get('/move-category-1-up',(req,res) => {
    
    let index = parseInt(req.query.index);

    AV.Promise.when(
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('index',index);
            query.first().done(item => {
                item.set('index',index-1);
                return item.save();
            }).done(()=> resolve());

        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('index',index-1);
            query.first().done(item => {
                item.set('index',index);
                return item.save();
            }).done(()=>resolve());
        })
    ).then(()=> res.send({success:1}));
    
});



//move-category-1-down
router.get('/move-category-1-down',(req,res) => {

    let index = parseInt(req.query.index);

    AV.Promise.when(
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('index',index);
            query.first().done(item => {
                item.set('index',index + 1);
                return item.save();
            }).done(()=> resolve());

        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('index',index + 1);
            query.first().done(item => {
                item.set('index',index);
                return item.save();
            }).done(()=>resolve());
        })
    ).then(()=> res.send({success:1}));

});



module.exports = router;