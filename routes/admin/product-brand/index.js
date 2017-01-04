'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');
let base = require('../../../lib/models/base');

//class
let ProductBrand = AV.Object.extend('ProductBrand');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 品牌介绍页`,
    currentTag: 'product',
    currentPage: 'product-brand'
});

//首页
router.get('/', (req, res) => {

    base.isUserLogin(req, res);  //判断是否登录

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let order = req.query.order || 'desc';
    
    let searchName = req.query['search-name'] ? req.query['search-name'].trim() : '';
    let searchType = req.query['search-type'] ? req.query['search-type'].trim() : '';

    data = extend(data,{
        searchName,
        searchType,
        flash: {success: req.flash('success'), error: req.flash('error')},
        user: req.AV.user
    });

    AV.Promise.when(
        
        //获取count
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductBrand);
            
            if (searchName.length) {
                query.contains('name',searchName);
            }
            
            if(searchType) {
                query.equalTo('type',searchType);
            }
            
            query.count().done(count => {
                data = extend(data, {
                    pager:pager.init(page,limit,count),
                    pagerHtml:pager.initHtml({
                        page,limit,count,
                        url:'/admin/product-brand',
                        serialize:{page,searchName,searchType,limit}
                    })
                });
                resolve();
            });

        }),

        //查询当前页所有数据
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductBrand);

            //查询条件
            {
                query.skip((page - 1) * limit);
                query.limit(limit);
                query.ascending('productBrandId');

                if (searchName.length) {
                    query.contains('name',searchName);
                }

                if(searchType) {
                    query.equalTo('type',searchType);
                }
            }
            
            query.find().then(items => {
                
                items.forEach( n => {
                    n.createdDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.createdAt.getMonth() + 1}/${n.createdAt.getDate()}`;
                    n.updatedDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.updatedAt.getMonth() + 1}/${n.updatedAt.getDate()}`;
                });
                
                data = extend(data, {
                    productBrand:items
                });
                
                resolve();
            });

        })

    ).then(() => res.render('admin/product-brand', data));

});


router.post('/remove/:productBrandId',(req,res)=> {
    
    let productBrandId = parseInt(req.params.productBrandId);
    
    let query = new AV.Query(ProductBrand);
    query.equalTo('productBrandId',productBrandId);
    query.first().then(item=> {
        return item.destroy();
    }).then(() => res.send({success: 1}));
    
});

module.exports = router;