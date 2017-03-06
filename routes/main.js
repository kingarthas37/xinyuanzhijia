'use strict';

require('express').Router();

module.exports = {
    
    //website
    '/':require('./default/index'),
    '/user/login':require('./default/user/login'),
    '/user/userinfo':require('./default/user/userinfo'),
    '/user/mobile':require('./default/user/mobile'),
    
    '/search':require('./default/search/index'),
    '/detail':require('./default/search/detail'),
    '/suggest':require('./default/search/suggest'),

    '/order/express': require('./default/order/express'),

    '/error':require('./default/error'),
    
    //admin
    '/admin/login':require('./admin/sign/login'),
    '/admin/register':require('./admin/sign/register'),
    '/admin/logout':require('./admin/sign/logout'),
    
    '/admin':require('./admin/index'),
    '/admin/product':require('./admin/product'),
    '/admin/product/add':require('./admin/product/add'),
    '/admin/product/edit':require('./admin/product/edit'),
    '/admin/product/copy':require('./admin/product/copy'),
    '/admin/product/upload':require('./admin/product/upload'),
    '/admin/product/preview':require('./admin/product/preview'),
    
    '/admin/product-category':require('./admin/product-category'),
    
    '/admin/product-method':require('./admin/product-method'),
    '/admin/product-method/add':require('./admin/product-method/add'),
    '/admin/product-method/edit':require('./admin/product-method/edit'),

    '/admin/product-brand':require('./admin/product-brand'),
    '/admin/product-brand/add':require('./admin/product-brand/add'),
    '/admin/product-brand/edit':require('./admin/product-brand/edit'),
    '/admin/product-brand/upload':require('./admin/product-brand/upload'),
    
    '/admin/product-property':require('./admin/product-property'),

    '/admin/product-tag':require('./admin/product-tag')
    
};
