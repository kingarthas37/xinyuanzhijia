'use strict';
let tableName = 'OrderTrack';
let base = require('../../lib/models/base');
let orderTrack, av, extend, config;
let md5 = require('md5');
require('../../lib/utils');

module.exports = {
    init() {
        extend = base.getExtend();
        orderTrack = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    getOrderByMobile(mobile, limit, orderBy) {
        let query = new av.Query(orderTrack);
        query.contains('shippingAddress', mobile);
        query.limit(limit);
        query['descending'](orderBy);
        return new Promise(function(resolve, reject) {
            query.find().then(items => {
                resolve(items);
            });
        });
    }
};