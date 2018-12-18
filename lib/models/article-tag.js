'use strict';
let tableName = 'ArticleTag';
let base = require('../../lib/models/base');
let articleTag, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        articleTag = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    add(data){
        let item = new articleTag();
        return new Promise(function(resolve, reject) {
            item.set('name', data.name);
            item.save().then(item => {
                resolve(item);
            });
        });
    },
    update(data, articleTagId){
        let query = new av.Query(articleTag);
        query.equalTo('articleTagId', articleTagId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('name', data.name);
                item.save();
                resolve();
            });
        });
    },
    getArticleTag(options){
        let query = new av.Query(articleTag);
        let limit = options.limit || 20;
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        if (options.name) {
            query.equalTo('name', options.name);
        }
        query.limit(limit);
        query['descending']('articleTagId');
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
    getArticleTagByArticleTagId(articleTagId) {
        let query = new av.Query(articleTag);
        query.equalTo('articleTagId', articleTagId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    }
};