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
router.get('/:code', (req, res) => {

    let code = req.params.code;
    res.render('default/index/'+code, data);

});

module.exports = router;