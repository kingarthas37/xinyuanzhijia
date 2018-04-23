'use strict';

require('express').Router();

module.exports = {
    
    //website
    '/':require('./default/index'),
    
    '/index':require('./default/index'),
    '/home':require('./default/index/home'),
    '/user/index':require('./default/user/index'),
    '/user/login':require('./default/user/login'),
    '/user/userinfo':require('./default/user/userinfo'),
    '/user/mobile':require('./default/user/mobile'),
    '/user/wish':require('./default/user/wish'),
    '/user/footmark':require('./default/user/footmark'),
    '/user/logout': require('./default/user/logout'),
    
    '/search':require('./default/search/index'),

    '/shopping-cart':require('./default/shopping-cart/index'),

    '/product':require('./default/product'),
    '/product/detail':require('./default/product/detail'),
    '/product/recommend':require('./default/product/recommend'),
    '/product/statistics':require('./default/product/statistics'),
    
    '/suggest':require('./default/search/suggest'),

    '/order/express': require('./default/order/express'),

    '/error':require('./default/error'),

    '/course':require('./default/course'),
    '/course/user':require('./default/course/user'),

    '/blog':require('./default/article'),
    
    //admin
    '/admin/login':require('./admin/sign/login'),
    '/admin/register':require('./admin/sign/register'),
    '/admin/logout':require('./admin/sign/logout'),
    
    '/admin':require('./admin/index'),
    
    '/admin/upload':require('./admin/upload/index'),
    
    '/admin/product':require('./admin/product'),
    '/admin/product/add':require('./admin/product/add'),
    '/admin/product/edit':require('./admin/product/edit'),
    '/admin/product/copy':require('./admin/product/copy'),
    '/admin/product/copy-etsy':require('./admin/product/copy-etsy'),
    '/admin/product/upload':require('./admin/product/upload'),
    '/admin/product/preview':require('./admin/product/preview'),
    '/admin/product/groups':require('./admin/product/groups'),
    
    '/admin/product-category':require('./admin/product-category'),
    
    '/admin/product-method':require('./admin/product-method'),
    '/admin/product-method/add':require('./admin/product-method/add'),
    '/admin/product-method/edit':require('./admin/product-method/edit'),

    '/admin/product-brand':require('./admin/product-brand'),
    '/admin/product-brand/add':require('./admin/product-brand/add'),
    '/admin/product-brand/edit':require('./admin/product-brand/edit'),
    
    '/admin/product-property':require('./admin/product-property'),

    '/admin/product-tag':require('./admin/product-tag'),
    '/admin/product-tag/add':require('./admin/product-tag/add'),
    '/admin/product-tag/edit':require('./admin/product-tag/edit'),

    '/admin/product-group':require('./admin/product-group'),
    '/admin/product-group/add':require('./admin/product-group/add'),
    '/admin/product-group/edit':require('./admin/product-group/edit'),

    '/admin/sync':require('./admin/sync'),

    '/admin/filter-words':require('./admin/filter-words'),
    '/admin/import-order':require('./admin/import-order'),

    '/admin/crontab':require('./admin/crontab'),

    '/admin/course':require('./admin/course'),
    '/admin/course/add':require('./admin/course/add'),
    '/admin/course/edit':require('./admin/course/edit'),
    '/admin/course-template':require('./admin/course-template'),
    '/admin/course-template/add':require('./admin/course-template/add'),
    '/admin/course-template/edit':require('./admin/course-template/edit'),
    '/admin/course-user':require('./admin/course-user'),

    '/admin/article':require('./admin/article'),
    '/admin/article/add':require('./admin/article/add'),
    '/admin/article/edit':require('./admin/article/edit'),
    '/admin/article/upload':require('./admin/article/upload'),
    '/admin/article/preview':require('./admin/article/preview'),
    '/admin/article-category':require('./admin/article-category'),
    '/admin/article-category/add':require('./admin/article-category/add'),
    '/admin/article-category/edit':require('./admin/article-category/edit'),
};
