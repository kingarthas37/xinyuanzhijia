'use strict';
let tableName = 'ProductCategory2';
let base = require('../../lib/models/base');
let productCategory, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productCategory = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProductCategorys(options){
        let query = new av.Query(productCategory);
        if (options.category1Id) {
            query.equalTo('category1Id', parseInt(options.category1Id));
        }
        query.ascending('index');
        return new Promise(function(resolve, reject) {
            query.find().then(items => {
                resolve(items);
            });
        });
    },
}