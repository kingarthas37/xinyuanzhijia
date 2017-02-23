'use strict';

let user = require('../../../lib/models/common-member').createNew();
let config = user.getConfig();
let router = user.getRouter();
let AV = user.getAV();

let async = require('async');
let extend = require('xtend');

require('../../../lib/utils');

let data = extend(config.data, {
    title:`${config.data.name}用户信息`,
    headerTitle:'用户信息',
    currentPage: 'userinfo'
});


router.get('/', (req,res) => {
    let sessionData = req.cookies.login;
    user.isWebUserLogin(req,res);
    let member = user.getDecodeByBase64(sessionData);
    user.getMemberByMemberId(parseInt(member.id)).then(result => {
        result.attributes.birthday = result.attributes.birthday ? result.attributes.birthday.format('yyyy/M/d') : null;
        data = extend(data,{
            user:result.attributes
        });
        res.render('default/user/userinfo',data);
    });


});

//保存userinfo
router.post('/edit', (req, res) => {
    user.isWebUserLogin(req,res,data);  //判断是否登录
    user.updateUserInfo(req,res);
});

module.exports = router;