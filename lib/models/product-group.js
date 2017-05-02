'use strict';
let tableName = 'ProductGroup';
let base = require('../../lib/models/base');
let productGroup, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productGroup = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getProductGroup(options) {
        let query = new av.Query(productGroup);
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        let limit = options.limit || 20;
        query.limit(limit);
        query['descending']('productGroupId');
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
    getProductGroupByProductGroupId(productGroupId) {
        let query = new av.Query(productGroup);
        query.equalTo('productGroupId', productGroupId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    },
    update(options, productGroupId) {
        let query = new av.Query(productGroup);
        query.equalTo('productGroupId', productGroupId);
        query.first().then(item => {
            item.set('productGroupName', options.productGroupName);
            item.save();
        });
    },
    add(options) {
        console.log(options);
        let group = new productGroup();
        group.set('productGroupName', options.productGroupName);
        group.save();
    },
    delete(productGroupId) {
        let query = new av.Query(productGroup);
        query.equalTo('productGroupId',productGroupId);

        query.first().then(item => {
            item.destroy();
        });
    }
}