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
    getTags(options) {
        let query = new av.Query(productTag);
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        let limit = options.limit || 20;
        query.limit(limit);
        if (options.search) {
            query.contains('tagName', options.search);
        }
        let order = options.order || 'productTagId';
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
    getTagById(productTagId) {
        let query = new av.Query(productTag);
        query.equalTo('productTagId', productTagId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    },
    add(datas) {
        let tagName = datas.tagName;
        let tag = new productTag();
        tag.set('tagName', tagName);
        tag.save();
    },
    edit(datas) {
        let productTagId = parseInt(datas.productTagId);
        let tagName = datas.tagName;
        let query = new av.Query(productTag);
        query.equalTo('productTagId', productTagId);
        query.first().then(item => {
            item.set('tagName', tagName);
            item.save();
        });
    },
    remove(productTagId) {
        let query = new av.Query(productTag);
        query.equalTo('productTagId',productTagId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.destroy();
                resolve({success: 1});
            });
        });
    }
}