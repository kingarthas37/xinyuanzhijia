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
    getSelect(data){
        return data;
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProducts(page, limit){
        let query = new av.Query(product);
        query.skip((page - 1) * limit);
        query.limit(limit);
        return new Promise(function(resolve, reject) {
            query.find().then(items=> {
                resolve(items);
            });
        });
    }
}