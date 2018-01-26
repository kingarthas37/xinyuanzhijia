'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let product = require('../../../lib/models/product');

let data = extend(config.data, {
    title: `${config.data.name} - 脚本`,
currentTag:'tools',
    currentPage: 'import-order'
});
let base = require('../../../lib/models/base');


//首页
router.get('/', (req, res) => {

    base.isAdminUserLogin(req,res);  //判断是否登录
    product.getProducts({'limit':1000, 'page':1, 'select':'nameEn,productId'}).then(result => {
        let index = 0;
        async.forEachLimit(result, 5, function(item, callback){
            //item.set('name', item.get('name').toUpperCase().trim().replace(/\t/g,' ').replace(/\s+/g,' '));
            item.set('nameEn', item.get('nameEn').toUpperCase().trim().replace(/\t/g,' ').replace(/\s+/g,' '));
          //  item.set('reserve', 0);
            item.save().then(() => {
                index++;
                console.log(index,item.get('productId'));
                callback();
            });
        });
    });

    res.send({'success':1});
});


module.exports = router;