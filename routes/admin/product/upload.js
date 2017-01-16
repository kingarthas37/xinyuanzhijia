'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let extend = require('xtend');
let config = require('../../../lib/config');

let upload = require('../../../lib/component/upload');
let base = require('../../../lib/models/base');

let data = extend(config.data, {
    title: '上传文件'
});


router.get('/',(req,res)=>{

    base.isUserLogin(req, res);  //判断是否登录
    
    let callbackName = req.query.callback || 'uploadFileSuccess';
    
    data = extend(data,{
        action:'/admin/product/upload',
        fileType: ['image/gif','image/jpeg','image/png'],
        multiple:true,
        callbackName:callbackName
    });
    res.render('admin/partials/upload',data);
});



router.post('/',(req,res)=>{

    base.isUserLogin(req, res);  //判断是否登录
    
    upload(req,result => {
        res.send(result);
    });
});

module.exports = router;