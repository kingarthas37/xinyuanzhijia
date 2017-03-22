'use strict';
let tableName = 'ProductWish';
let base = require('../../lib/models/base');
let productWish, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productWish = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getWishByCommonMemberId(options) {
        let query = new av.Query(productWish);
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        let limit = options.limit || 20;
        query.limit(limit);
        query.equalTo('commonMemberId', options.commonMemberId);
        let order = options.order || 'createdAt';
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
    getWishByProductId(productId) {
        let query = new av.Query(productWish);
        query.equalTo('productId', productId);
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        let limit = options.limit || 20;
        query.limit(limit);
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
    getWishCountByProductId(productId) {
        let query = new av.Query(productWish);
        query.equalTo('productId', productId);
        return new Promise(function(resolve, reject) {
            query.count().then(count=> {
                let data = {'count':count};
                resolve(data);
            });
        });
    },
    getWishByCommonMemberIdAndProductId(commonMemberId, productId) {
        let query = new av.Query(productWish);
        query.equalTo('productId', productId);
        query.equalTo('commonMemberId', commonMemberId);
        query.equalTo('status', true);
        return new Promise(function(resolve, reject) {
            query.first().then(item=> {
                if (item) {
                    resolve({'wish':true});
                } else {
                    resolve({'wish':false});
                }

            });
        });
    },
    add(datas) {
        let wish = new productWish();
        wish.set('productId', parseInt(datas.productId));
        wish.set('commonMemberId', parseInt(datas.commonMemberId));
        wish.set('status', true);
        wish.set('type', 'product');
        wish.save();
    },
    edit(datas) {
        let productId = parseInt(datas.productId);
        let commonMemberId = parseInt(datas.commonMemberId);
        let query = new av.Query(productWish);
        query.equalTo('productId', productId);
        query.equalTo('commonMemberId', commonMemberId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('status', datas.status);
                item.save();
                resolve(item);
            });
        });
    }
}