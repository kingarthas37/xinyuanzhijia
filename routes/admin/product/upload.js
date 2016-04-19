'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let extend = require("xtend");
let config = require('../../../lib/config');

let upload = require('../../../lib/component/upload');

let data = extend(config.data, {
    title: '上传产品图片'
});


router.get('/',(req,res)=>{
    data = extend(data,{
        action:'/admin/product/upload',
        fileType: ['image/gif','image/jpeg','image/png'],
        multiple:true
    });
    res.render('admin/partials/upload',data);
});



router.post('/',(req,res)=>{
    upload(req,result => {
        res.send(result);
    });
});



module.exports = router;