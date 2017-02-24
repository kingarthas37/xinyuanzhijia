'use strict';

let product = require('../../../lib/models/product-all').createNew();
let request = product.getRequest();
let config = product.getConfig();
let router = product.getRouter();
let extend = product.getExtend();
let async = product.getAsync();
let AV = product.getAV();

let data = extend(config.data, {
    title: `${config.data.name} - 搜索`,
    currentPage: 'detail'
});

router.get('/', (req, res) => {
    let id = req.query.id ? parseInt(req.query.id) : null;
    let member = req.cookies.login ? product.getDecodeByBase64(req.cookies.login) : null;
    product.getProductById(id).then(result => {
        if(result) {
            product.updateProductPageViews(result);
            let memberId = member ? member.id : null;
            data = extend(data, result);
            res.render('default/search/detail', data);
        } else {
            res.redirect('/error/404');
        }
    });
});

module.exports = router;