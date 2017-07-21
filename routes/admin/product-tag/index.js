'use strict';

let productTag = require('../../../lib/models/product-tag').createNew();
let config = productTag.getConfig();
let router = productTag.getRouter();
let extend = productTag.getExtend();
let pager = require('../../../lib/component/pager');
let flash = require('connect-flash');

var data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品标签编辑`,
    currentTag: 'product-settings',
    currentPage: 'product-tag'
});


router.get('/', (req, res) => {

    productTag.isAdminUserLogin(req, res);  //判断是否登录

    let search = req.query.search ? req.query.search.trim() : '';
    data = extend(data, {
        search: search,
        flash: {success: req.flash('success'), error: req.flash('error')},
        user: req.AV.user
    });
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = 20;
    productTag.getTags({page, search}).then(result => {
        let count = result.count;
        data = extend(data, {
            pager:pager.init(page,limit,count),
            pagerHtml:pager.initHtml({
                page,limit,count,
                url:'/admin/product-tag',
                serialize:{page,search,limit}
            }),
            productTag: result.items
        });
        res.render('admin/product-tag', data);
    });
});

router.post('/remove/:productTagId',(req,res)=> {

    let productTagId = parseInt(req.params.productTagId);

    productTag.remove(productTagId).then(result => {
        res.render(result);
    });

});


module.exports = router;