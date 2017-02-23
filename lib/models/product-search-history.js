'use strict';
let tableName = 'ProductSearchHistory';
let base = require('../../lib/models/base');
let productSearchHistory, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        productSearchHistory = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    setKeywordsHistory(keywords) {
        let _this= this;
        return new Promise(function (resolve, reject) {
            _this.getKeywordsHistoryByKeywords(keywords).then(result => {
                if (result) {
                    result.set("count", result.attributes.count + 1);
                    result.save();
                    resolve({id: result.attributes.productSearchHistoryId});
                } else {
                    resolve(_this.add(keywords));
                }
            });
        });
    },
    getKeywordsHistoryByKeywords(keywords) {
        let query = new av.Query(productSearchHistory);
        query.equalTo('keywords', keywords);
        return new Promise(function (resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    },
    getKeywordsHistoryByObjectId(objectId){
        let query = new av.Query(productSearchHistory);
        query.equalTo('objectId', objectId);
        return new Promise(function (resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    },
    add(keywords){
        let history = new productSearchHistory();
        history.set('keywords', keywords);
        let _this = this;
        return new Promise(function (resolve, reject) {
            history.save().then(result => {
                _this.getKeywordsHistoryByObjectId(result.id).then(item => {
                    resolve({id: item.attributes.productSearchHistoryId});
                });
            });
        });
    },
    getKeywords(options){
        let query = new av.Query(productSearchHistory);
        if (options.keywords) {
            query.contains('keywords', options.keywords);
        }
        let limit = options.limit || 9;
        if (options.page) {
            query.skip((options.page - 1) * limit);
        }
        query.limit(limit);
        query['descending']('count');
        return new Promise(function(resolve, reject) {
            query.find().then(items => {
                let data = {'count':0, 'items': items};
                if (options.page) {
                    query.count().then(count => {
                        data = extend(data, {'count' : count});
                        resolve(data);
                    });
                } else {
                    resolve(data);
                }
            });
        });
    }
}