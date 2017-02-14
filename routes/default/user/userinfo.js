'use strict';

let user = require('../../../lib/models/user').createNew();
let base = require('../../../lib/models/base');
let request = user.getRequest();
let config = user.getConfig();
let router = user.getRouter();
let AV = base.getAV();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.name}用户信息`,
    headerTitle:'用户信息',
    currentPage: 'userinfo'
});


router.get('/', (req,res) => {
    base.isWebUserLogin(req,res);
    data = extend(data,{
        
    });
    res.render('default/user/userinfo',data);
});

router.post('/edit', (req, res) => {
    base.isWebUserLogin(req, res);  //判断是否登录
    user.updateUserInfo(req);
}); 

module.exports = router;