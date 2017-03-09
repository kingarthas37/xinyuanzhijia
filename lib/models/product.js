'use strict';
let tableName = 'Product';
let base = require('../../lib/models/base');
let product, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        product = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProducts(options, isCount){
        let limit = options.limit || 20;
        let page = (options.page - 1) * limit;
        var cql = 'select * from Product where objectId != null';
        if (isCount) {
            cql = 'select count(*) from Product where objectId != null';
        }
        var pvalues = [];
        if (options.onsale > 0) {
            let onSale = (options.onsale == 1 ? true : false);
            cql += ' and isOnsale = ?';
            pvalues.push(onSale);
        }
        if (options.stock) {
            cql += ' and stock > 0';
        }
        /*if (options.onsale > 0) {
            let onSale = (options.onsale == 1 ? true : false);
            cql += ' and productId in (select productId from ProductProperty where isOnsale = ? ';
            pvalues.push(onSale);
            if (options.stock) {
                cql += ' and stock > 0';
            }
            if (options.price) {
                cql += ' order by price ' + options.price;
            }
            cql += ')';
        }*/
        if (options.productMethodId) {
            cql += ' and productMethod = ?';
            pvalues.push(options.productMethodId);
        }
        if (options.category2Id) {
            cql += ' and category2 = ?';
            pvalues.push(options.category2Id);
        }
        if (options.search) {
            cql += ' and name like ?';
            pvalues.push('%'+options.search+'%');
        }
        if (options.category1Id) {
            cql += ' and category1 = ?';
            pvalues.push(options.category1Id);
        }
        if (!isCount) {
            if (options.price) {
                cql += ' order by price ' + options.price;
            } else {
                if (options.order) {
                    cql += ' order by '+options.order+' desc';
                }
            }
            cql += ' limit ?, ?';
            pvalues.push(page);
            pvalues.push(limit);
        }
        return new Promise(function(resolve, reject) {
            av.Query.doCloudQuery(cql, pvalues).then(function (data) {
                let result = data.results;
                if (isCount) {
                    result = data.count;
                }
                resolve(result);

            }, function (error) {
                resolve(error);
            });
        });
    },
    getProductById(id){
        let query = new av.Query(product);
        query.equalTo('productId', id);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    },
    updateProductPageViews(product) {
        product.set('pageViews', (product.get('pageViews')+1));
        product.save();
    },
    update(options, productId) {
        let query = new av.Query(product);
        query.equalTo('productId', productId);
        query.first().then(item => {
            item.set('isOnsale', options.isOnsale);
            item.set('stock', options.stock);
            item.set('sales', options.sales);
            item.set('isHandmade', options.isHandmade);
            item.set('isDocument', options.isDocument);
            item.set('shopLink', options.shopLink);
            item.set('purchaseLink', options.purchaseLink);
            item.save();
        });
    }
}