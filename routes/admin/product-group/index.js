'use strict';

let flash = require('connect-flash');


let pager = require('../../../lib/component/pager');

let productGroup = require('../../../lib/models/product-group').createNew();
let request = productGroup.getRequest();
let config = productGroup.getConfig();
let router = productGroup.getRouter();
let extend = productGroup.getExtend();
let async = productGroup.getAsync();
let AV = productGroup.getAV();

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 产品列表页`,
    currentTag: 'product-settings',
    currentPage: 'product-index',
    watermark:config.watermark
});

//首页
router.get('/', (req, res) => {

    productGroup.isAdminUserLogin(req, res);  //判断是否登录

    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    data = extend(data, {
        flash :  {success: req.flash('success'), error: req.flash('error')}
    });
    productGroup.getProductGroup({page, limit}).then(result => {
        var count = result.count;
        result.items.forEach( n => {
            n.updatedDate = `${n.updatedAt.getFullYear().toString().substring(2)}/${n.updatedAt.getMonth() + 1}/${n.updatedAt.getDate()}`;
        });
        data = extend(data, {
            pager: pager.init(page, limit, count),
            items: result.items,
            pagerHtml: pager.initHtml({
                page, limit, count,
                url: '/admin/product',
                serialize: {
                    page
                }
            })
        });
        res.render('admin/product-group', data);
    });
});

router.post('/remove/:productGroupId', (req, res) => {
    let productGroupId = parseInt(req.params.productGroupId);
    productGroup.delete(productGroupId);
    res.send({success: 1})
});

module.exports = router;