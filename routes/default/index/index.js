'use strict';

let user = require('../../../lib/models/common-member').createNew();
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
    if (req.cookies.login) {
        let member = user.getDecodeByBase64(req.cookies.login);
        data = extend(data, member);
    }
    res.render('default/index/index',data);

});

module.exports = router;