'use strict';

require('express').Router();

module.exports = {
    
    //admin
    '/admin/login':require('./admin/sign/login'),
    '/admin/register':require('./admin/sign/register'),
    '/admin/logout':require('./admin/sign/logout'),
    
    '/admin':require('./admin/index'),

    '/admin/product':require('./admin/product'),
    '/admin/product/add':require('./admin/product/add'),
    '/admin/product/edit':require('./admin/product/edit'),
    '/admin/product/upload':require('./admin/product/upload'),
    //'/admin/product/preview':require('./admin/product/preview')
   
    '/admin/product-category':require('./admin/product-category')
    
};