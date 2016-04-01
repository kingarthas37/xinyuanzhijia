'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require("xtend");
let config = require('../../../lib/config');

//class
let Product = AV.Object.extend('Product');
let Category = AV.Object.extend('ProductCategory');

//component
let pager = require('../../../lib/component/pager');

let data = extend(config.data,{
    title: '产品编辑-首页',
    currentPage: 'product'
});
 

//首页
router.get('/', function (req, res, next) {
    
    //if(!req.AV.user) {
    //    return res.redirect('/login?return=' + encodeURIComponent(req.originalUrl));
    //}
    
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.LIMIT;
    let order = req.query.order || 'desc';

    let categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : '';
    let search = req.query['search'] ? req.query['search'].trim() : '';

    data = extend(data,{
        categoryId:categoryId,
        search:search,
        flash:{success:req.flash('success'),error:req.flash('error')},
        user:req.AV.user
    });

    {
        let query = new AV.Query(Product);
        
        if(categoryId) {
            query.equalTo('categoryId',categoryId);
        }

        if(search) {
            query.contains('name',search);
        }
        
        query.count().done(count => {
          
            data = extend(data,{
                productPager:pager(page,limit,count),
                productCount:count
            });
            
            query.skip((page - 1) * limit);
            query.limit(limit);

            if(order === 'asc') {
                query.ascending('productId');
            } else {
                query.descending('productId');
            }

            if(categoryId) {
                query.equalTo('categoryId',categoryId);
            }

            if(search) {
                query.contains('name',search);
            }
            
            return query.find();
            
        }).done(results => {
            data = extend(data, {
                product: results
            });

            let queryCategory = new AV.Query(Category);
            return queryCategory.find();
           
        }).done(results=> {
            
            data = extend(data,{
                category:results
            });
            
            for (let i in data.product) {
                data.product[i].set('categoryName',(()=> {
                    for (let _i in results) {
                        if (results[_i].get('categoryId') === data.product[i].get('categoryId')) {
                            return results[_i].get('categoryName');
                        }
                    }
                })());
            }

            return res.render('admin/product', data);
            
        });
    }

});


router.get('/remove/:productId', function (req, res, next) {

    var productId = req.params.productId;

    async.waterfall([

        function (cb) {
            var query = new AV.Query(Product);
            query.equalTo('productId', parseInt(productId));
            query.first({

                success: function (object) {
                    cb(null, object);
                },

                error: function (err) {
                    next(err);
                }

            });
        },
        function (object, cb) {
            object.destroy({
                success: function () {
                    req.flash('success', '删除成功!');
                    res.redirect('/product');
                }
            });
        }

    ]);
});



module.exports = router;