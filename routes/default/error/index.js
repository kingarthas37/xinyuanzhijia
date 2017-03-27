'use strict';

let user = require('../../../lib/models/common-member').createNew();
let config = user.getConfig();
let router = user.getRouter();

let async = require('async');
let extend = require('xtend');

let data = extend(config.data, {
    title:`${config.data.title}出错了`,
    currentPage: 'error'
});

//首页
router.get('/:code', (req, res) => {
    let code = req.params.code;
    console.log(code);
    res.render('default/error/'+code, data);

});

module.exports = router;