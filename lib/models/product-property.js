'use strict';
let tableName = 'ProductProperty';
let base = require('../../lib/models/base');
let productProperty, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productProperty = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProductProperties(){
        let query = new av.Query(productProperty);
        query.limit(999);
        query.select(['sales', 'productId', 'isOnsale', 'isDocument', 'isHandmade', 'shopLink', 'purchaseLink', 'stock', 'price']);
        query['descending']('productId');
        return new Promise(function(resolve, reject) {
            query.count().then(count=> {
                let data = {'count':count, 'items': null};
                if (count > 0) {
                    query.find().then(items=> {
                        data = extend(data, {'items': items});
                        resolve(data);
                    });
                } else {
                    resolve(data);
                }
            });

        });
    }
}