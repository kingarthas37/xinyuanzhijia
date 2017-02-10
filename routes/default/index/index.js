'use strict';

let user = require('../../../lib/models/user').createNew();
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

    data = extend(data,{
       // username:req.currentUser.attributes.username
    });
    
    res.render('default/index',data);
    

});

module.exports = router;