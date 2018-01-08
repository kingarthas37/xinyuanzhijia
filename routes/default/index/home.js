'use strict';

let user = require('../../../lib/models/common-member').createNew();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.name}首页`,
    currentPage: 'index'
});

//首页
router.get('/', (req, res) => {
    /*let baseUrl = req.baseUrl.replace('/', '');
    var rewrite = {indiooil:'/product?cat1=79&method=3'};
    if (rewrite[baseUrl]) {
        res.redirect(rewrite[baseUrl]);
        return;
    }
    if (req.cookies.login) {
        let member = user.getDecodeByBase64(req.cookies.login);
        data = extend(data, member);
    }*/
    if (req.headers['user-agent'].toLowerCase().indexOf('mobile') > -1) {
        res.redirect('/');
    } else {
    // console.log('/Users/Ebates/Desktop/chamWork/H5/xinyuanzhijia/routes/default/index/home.js 开始画 首页')
        res.render('default/index/home',data);
    }

});

module.exports = router;