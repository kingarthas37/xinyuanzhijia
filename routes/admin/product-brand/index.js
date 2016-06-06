'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let pager = require('../../../lib/component/pager');

//class
let ProductBrand = AV.Object.extend('ProductBrand');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 品牌介绍页`,
    currentTag: 'product',
    currentPage: 'product-brand'
});

//首页
router.get('/', (req, res) => {

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let order = req.query.order || 'desc';
    
    let search = req.query.search ? req.query.search.trim() : '';

    data = extend(data,{
        search: search,
        flash: {success: req.flash('success'), error: req.flash('error')},
        user: req.AV.user
    });

    AV.Promise.when(
        
        //获取count
        new AV.Promise(resolve => {

            let query = new AV.Query(ProductBrand);
            
            if (search.length) {
                query.contains('name', search);
            }
            
            query.count().done(count => {
                data = extend(data, {
                    pager:pager.init(page,limit,count),
                    pagerHtml:pager.initHtml({
                        page,limit,count,
                        url:'/admin/product-brand',
                        serialize:{page,search,limit}
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
                
                if (search.length) {
                    query.contains('name', search);
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
    
    query.first().then(item => {
        
        if(item) {
            res.send({success: 0,message:'该产品类型含有分类,请先删除所有子分类后再进行删除'});
            return AV.Promise.error();
        }
        
        let query = new AV.Query(ProductBrand);
        query.equalTo('productBrandId',productBrandId);
        return query.first();
        
    }).then(item => {
        return item.destroy();
    }).then(() => res.send({success: 1}));
    
});

module.exports = router;