'use strict';
let tableName = 'ProductClick';
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
    setProductClick() {

    }
}