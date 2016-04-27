'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let extend = require("xtend");
let config = require('../../../lib/config');

let upload = require('../../../lib/component/upload');

let data = extend(config.data, {
    title: '上传文件'
});


router.get('/',(req,res)=>{

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
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

    if(!req.AV.user) {
        return res.redirect(`/admin/login?return=${encodeURIComponent(req.originalUrl)}`);
    }
    
    upload(req,result => {
        res.send(result);
    });
});

module.exports = router;