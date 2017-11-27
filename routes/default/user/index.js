'use strict';

let user = require('../../../lib/models/common-member').createNew();
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.name}首页`,
    headerTitle:'我的账户',
    currentPage: 'user-index'
});


router.get('/', (req,res) => {
    if(!req.cookies.login) {
        res.redirect('/user/login');
    }
    res.render('default/user/index', data);
});

module.exports = router;