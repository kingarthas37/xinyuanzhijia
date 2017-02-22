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


router.get('/', (req,res) => {
    user.isWebUserLogin(req,res);
    res.render('default/user/mobile',data);
});


router.post('/update/:mobile/:code',(req,res)=> {
    setTimeout(function() {
        res.send({
            success:1
        });
    },2000);
});

module.exports = router;