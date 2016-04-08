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

        //按index排序
        query1.ascending('index');
        query1.find().done(items=> {

            data = extend(data, {
                category: items
            });

            return query2.find();
            
        }).done(items2 => {

            data.category.forEach(item1 => {
                item1.contents = [];
                items2.forEach(item2 => {
                    if (item1.get('productCategory1Id') === item2.get('productCategory1Id')) {
                        item1.contents.push(item2);
                    }
                });
                //对二级分类进行index排序
                item1.contents.sort((a,b)=> {
                    return a.get('index') > b.get('index');
                });
            });
            return res.render('admin/product-category', data);
        });

    }

});


//添加二级分类
router.post('/add-category-2',(req,res)=> {
    
    let index = parseInt(req.body.index);
    let name = req.body.name;
    let productCategory1Id = parseInt(req.body.productCategory1Id);
    
    let category2 = new ProductCategory2();
    category2.set('index',index);
    category2.set('name',name);
    category2.set('productCategory1Id',productCategory1Id);
    
    category2.save().done(data => {
        let query = new AV.Query(ProductCategory2);
        query.equalTo('objectId',data.id);
        return query.first();
    }).done(data => res.send({success:1,id:data.get('productCategory2Id'),name:name}));
    
});

//删除一级分类
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

        }).done(()=>res.send({success: 1}));
    });
});


//删除二级分类
router.get('/remove-category-2', (req, res) => {

    let query = new AV.Query(ProductCategory2);
    
    let category1Id = parseInt(req.query.category1Id);
    let category2Id = parseInt(req.query.category2Id);

    query.equalTo('productCategory2Id', category2Id);

    query.first().done(item => {

        item.destroy().done(() => {

            let query = new AV.Query(ProductCategory2);
            query.equalTo('productCategory1Id',category1Id);
            query.ascending('index');
            
            return query.find();

        }).done(items => {
            //批量更新index
            let promises = [];
            items.forEach((item, i) => {
                item.set('index', i);
                promises.push(item.save());
            });
            return AV.Promise.when(promises);

        }).done(()=>res.send({success: 1}));
    });
});


//上移一级分类
router.get('/move-category-1-up',(req,res) => {
    
    let currentId = parseInt(req.query.currentId);
    let targetId = parseInt(req.query.targetId);

    AV.Promise.when(
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('productCategory1Id',currentId);
            query.first().done(item => {
                console.info(111, item);
                item.set('index',item.get('index') - 1);
                return item.save();
            }).done(resolve);

        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('productCategory1Id',targetId);
            query.first().done(item => {
                console.info(222, item);
                item.set('index',item.get('index') + 1);
                return item.save();
            }).done(resolve);
        })
    ).then(()=> res.send({success:1}));
    
});

//上移二级分类
router.get('/move-category-2-up',(req,res) => {

    let currentId = parseInt(req.query.currentId);
    let targetId = parseInt(req.query.targetId);

    AV.Promise.when(
        new AV.Promise(resolve => {
            
            let query = new AV.Query(ProductCategory2);
            query.equalTo('productCategory2Id',currentId);
            
            query.first().done(item => {
                item.set('index',item.get('index') - 1);
                return item.save();
            }).done(resolve);

        }),
        new AV.Promise(resolve => {
            
            let query = new AV.Query(ProductCategory2);
            query.equalTo('productCategory2Id',targetId);

            query.first().done(item => {
                item.set('index',item.get('index') + 1);
                return item.save();
            }).done(resolve);
        })
    ).then(()=> res.send({success:1}));

});

//下移一级分类
router.get('/move-category-1-down',(req,res) => {

    let currentId = parseInt(req.query.currentId);
    let targetId = parseInt(req.query.targetId);

    AV.Promise.when(
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('productCategory1Id',currentId);
            query.first().done(item => {
                item.set('index',item.get('index') + 1);
                return item.save();
            }).done(resolve);

        }),
        new AV.Promise(resolve => {
            let query = new AV.Query(ProductCategory1);
            query.equalTo('productCategory1Id',targetId);
            query.first().done(item => {
                item.set('index',item.get('index') - 1);
                return item.save();
            }).done(resolve);
        })
    ).then(() => res.send({success:1}));

});



//下移二级分类
router.get('/move-category-2-down',(req,res) => {

    let currentId = parseInt(req.query.currentId);
    let targetId = parseInt(req.query.targetId);

    AV.Promise.when(
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductCategory2);
            query.equalTo('productCategory2Id',currentId);

            query.first().done(item => {
                item.set('index',item.get('index') + 1);
                return item.save();
            }).done(resolve);

        }),
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductCategory2);
            query.equalTo('productCategory2Id',targetId);

            query.first().done(item => {
                item.set('index',item.get('index') - 1);
                return item.save();
            }).done(resolve);
        })
    ).then(()=> res.send({success:1}));

});


module.exports = router;