'use strict';

let user = require('../../../lib/models/common-member').createNew();
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.name}首页`,
    headerTitle:'用户登录/注册',
    currentPage: 'logout'
});

router.get('/', (req, res) => {
    res.cookie('login', false, {maxAge: -1000});
    res.cookie('login', false, {maxAge: -1000, domain: config.website.cookieDomain});
    res.redirect('/');
});

module.exports = router;