'use strict';

let productTag = require('../../../lib/models/product-tag').createNew();
let config = productTag.getConfig();
let router = productTag.getRouter();
let extend = productTag.getExtend();

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加产品标签`,
    currentTag: 'product-settings',
    currentPage: 'product-tag'
});

router.get('/', (req, res) => {

    productTag.isAdminUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user:req.AV.user
    });

    res.render('admin/product-tag/add', data);

});


router.post('/', (req, res) => {

    productTag.isAdminUserLogin(req, res);  //判断是否登录

    let tagName = req.body['tagName'];

    productTag.add({tagName});
    req.flash('success', '添加标签成功!');
    res.redirect('/admin/product-tag');
});


module.exports = router;