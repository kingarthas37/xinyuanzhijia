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
    getSelect(data){
        return data;
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProducts(page, limit, order, keywords, categoryId, isHandiwork, inventory, place){
        let query = new av.Query(product);
        query.skip((page - 1) * limit);
        query.limit(limit);
        if (categoryId) {
            query.equalTo('categoryId', categoryId);
        }
        if (keywords) {
            query.contains('name', keywords);
        }
        if (isHandiwork) {
            query.equalTo('handiwork', isHandiwork);
        }
        if (inventory) {
            query.greaterThanOrEqualTo('inventory', inventory);
        }
        if (place) {
            query.equalTo('productionPlace', place);
        }
        query['descending'](order);
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
                console.log(item);
                resolve(item);
            });
        });
    }   
}