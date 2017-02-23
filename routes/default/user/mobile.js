'use strict';

let user = require('../../../lib/models/common-member').createNew();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

require('../../../lib/utils');

let data = extend(config.data, {
    title:`${config.data.name}绑定手机号`,
    headerTitle:'绑定手机号',
    currentPage: 'mobile'
});


router.get('/:id', (req,res) => {
    let sessionData = req.cookies.login;
    user.isWebUserLogin(req,res);
    let member = user.getDecodeByBase64(sessionData);
    if (member.id == req.params.id) {
        data = extend(data,{
            memberId:req.params.id
        });
        res.render('default/user/mobile',data);
    } else {
        res.redirect("/");
    }
});


router.post('/update/:mobile/:code/:id',(req,res)=> {

    let mobile = req.params.mobile;
    let smsCode = req.params.code;
    let memberId= req.params.id;
    user.updateUserMobile(mobile, smsCode, memberId).then(result => {
        res.send(result);
    });
});

module.exports = router;