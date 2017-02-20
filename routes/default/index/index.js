'use strict';

let user = require('../../../lib/models/common-member').createNew();
let wechat = require('../../../lib/models/wechat').createNew();;
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
    console.log(req.session.member);
    if (!req.session.member) {
        user.getMemberByObjectId(req,res).then(result => {
            data = extend(data, result);
        });
    }
    res.render('default/index/index',data);
    

});

module.exports = router;