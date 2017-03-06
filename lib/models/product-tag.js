'use strict';
let tableName = 'ProductTag';
let base = require('../../lib/models/base');
let productTag, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productTag = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    add(datas){

    },
}