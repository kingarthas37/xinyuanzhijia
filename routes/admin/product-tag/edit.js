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

router.get('/:productTagId', (req, res) => {

    productTag.isAdminUserLogin(req, res);  //判断是否登录

    data = extend(data, {
        user:req.AV.user
    });
    let productTagId = parseInt(req.params.productTagId);
    productTag.getTagById(productTagId).then(item => {
        data = extend(data,{
            productTag:item
        });
        res.render('admin/product-tag/edit', data);
    });

});


router.post('/:productTagId', (req, res) => {

    productTag.isAdminUserLogin(req, res);  //判断是否登录

    let tagName = req.body['tagName'];
    let productTagId = req.params.productTagId;
    productTag.edit({
        tagName,productTagId
    });
    req.flash('success', '修改标签成功!');
    res.redirect('/admin/product-tag');
});


module.exports = router;