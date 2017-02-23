'use strict';
let tableName = 'ProductAll';
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
    getProducts(options){
        let query = new av.Query(product);
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        let limit = options.limit || 10;
        query.limit(limit);
        if (options.categoryId) {
            query.equalTo('categoryId', options.categoryId);
        }
        if (options.keywords) {
            query.contains('name', options.keywords);
        }
        if (options.isHandiwork) {
            query.equalTo('handiwork', options.isHandiwork);
        }
        if (options.inventory) {
            query.greaterThanOrEqualTo('inventory', options.inventory);
        }
        if (options.place) {
            query.equalTo('productionPlace', options.place);
        }
        query['descending'](options.order);
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
    },
    getProductById(id){
        let query = new av.Query(product);
        query.equalTo('productAllId', id);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    }
}