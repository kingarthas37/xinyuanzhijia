'use strict';

let user = require('../../../lib/models/common-member').createNew();
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.name}首页`,
    headerTitle:'用户中心',
    currentPage: 'user-index'
});


router.get('/', (req,res) => {
    if(req.cookies.login) {
        res.redirect('/');
    }
    res.render('default/user/index');
});

module.exports = router;