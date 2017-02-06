'use strict';

let user = require('../../../lib/models/user').createNew();
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.title}首页`,
    currentPage: 'index'
});

//首页
router.get('/', (req, res) => {
    
    res.render('default/index',data);

});

module.exports = router;