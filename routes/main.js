'use strict';

require('express').Router();

module.exports = {
    
    //admin
    '/admin':require('./admin/index'),

    '/admin/product':require('./admin/product'),
    '/admin/product/add':require('./admin/product/add')
    //'/admin/product/edit':require('./admin/product/edit'),
    //'/admin/product/preview':require('./admin/product/preview')
   
    
};