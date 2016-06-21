'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 首页`,
    currentPage: 'index'
});

//首页
router.get('/', (req, res) => {
    
    res.render('default/index');

});

module.exports = router;