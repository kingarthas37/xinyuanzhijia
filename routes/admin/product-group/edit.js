'use strict';

let productGroup = require('../../../lib/models/product-group').createNew();
let request = productGroup.getRequest();
let config = productGroup.getConfig();
let router = productGroup.getRouter();
let extend = productGroup.getExtend();
let async = productGroup.getAsync();
let AV = productGroup.getAV();

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 编辑产品组合类型`,
    currentTag: 'product',
    currentPage: 'product-group'
});

router.get('/:productGroupId', (req, res) => {

    productGroup.isAdminUserLogin(req, res);  //判断是否登录
    data = extend(data, {
        user:req.AV.user
    });
    var productGroupId = parseInt(req.params.productGroupId);
    productGroup.getProductGroupByProductGroupId(productGroupId).then(item => {
        data = extend(data, {productGroup:item});
        res.render('admin/product-group/edit', data);
    });

});


router.post('/:productGroupId', (req, res) => {

    productGroup.isAdminUserLogin(req, res);  //判断是否登录

    let name = req.body['name'];
    var productGroupId = parseInt(req.params.productGroupId);
    productGroup.update({'productGroupName': name}, productGroupId);
    req.flash('success', '编辑产品组合类型成功!');
    res.redirect('/admin/product-group');
});


module.exports = router;