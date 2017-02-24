'use strict';
let tableName = 'ProductClick';
let base = require('../../lib/models/base');
let productClick, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productClick = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    setProductClick(memberId,productAll,productAllId) {
        this.add({'memberId': parseInt(memberId), 'productType': productAll, 'productId': parseInt(productAllId)});
    },
    add(options) {
        let click = new productClick();
        if (options.memberId) {
            click.set('commonMemberId', options.memberId);
        }
        click.set('productType', options.productType);
        click.set('productId', options.productId);
        click.save();
    }
}