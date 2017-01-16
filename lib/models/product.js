'use strict';
let tableName = 'Product';
let base = require('../../lib/models/my-base');
let product, av;
module.exports = {
    init() {
        product = base.getObject(tableName);
        av = base.getAV();
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
        return query.find().then(items=> {
            items.forEach(k => {
                console.log(k);
            });
        });
    },
}