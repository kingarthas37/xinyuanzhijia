'use strict';

let productGroup = require('../../../lib/models/product-group').createNew();
let request = productGroup.getRequest();
let config = productGroup.getConfig();
let router = productGroup.getRouter();
let extend = productGroup.getExtend();
let async = productGroup.getAsync();
let AV = productGroup.getAV();

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加产品组合类型`,
    currentTag: 'product',
    currentPage: 'product-group'
});

router.get('/', (req, res) => {

    productGroup.isAdminUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user:req.AV.user
    });

    res.render('admin/product-group/add', data);

});


router.post('/', (req, res) => {
    productGroup.isAdminUserLogin(req, res);  //判断是否登录
    let name = req.body['name'];
    productGroup.add({'productGroupName': name});
    req.flash('success', '添加产品组合类型成功!');
    res.redirect('/admin/product-group');
});


module.exports = router;