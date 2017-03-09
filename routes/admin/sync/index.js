'use strict';

let product = require('../../../lib/models/product').createNew();
let productProperty = require('../../../lib/models/product-property').createNew();
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
    product.isAdminUserLogin(req, res);  //判断是否登录
    productProperty.getProductProperties().then(result => {
        if (result.count > 0) {
            let items = result.items;
            let i = 1;
            items.forEach(value => {
                    product.update({
                        'isOnsale': value.get('isOnsale'),
                        'isHandmade': value.get('isHandmade'),
                        'sales': value.get('sales'),
                        'isDocument': value.get('isDocument'),
                        'shopLink': value.get('shopLink'),
                        'purchaseLink': value.get('purchaseLink'),
                        'stock': value.get('stock')
                    }, value.get('productId'));
            });
            res.send('ok');
        } else {
            res.send('error');
        }
    });
});

module.exports = router;