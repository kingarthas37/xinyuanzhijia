'use strict';
let tableName = 'ProductMethod';
let base = require('../../lib/models/base');
let productMethod, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productMethod = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProductMethods() {
        let query = new av.Query(productMethod);
        query.limit(99);
        return new Promise(function(resolve, reject) {
            query.find().then(items=> {
                resolve({'items': items});
            });
        });
    }
}