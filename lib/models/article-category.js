'use strict';
let tableName = 'ArticleCategory';
let base = require('../../lib/models/base');
let articleCategory, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        articleCategory = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    add(data){
        let item = new articleCategory();
        return new Promise(function(resolve, reject) {
            item.set('name', data.name);
            item.set('parentId', data.parentId);
            item.save().then(item => {
                resolve(item);
            });
        });
    },
    update(data, articleCategoryId){
        let query = new av.Query(articleCategory);
        query.equalTo('articleCategoryId', articleCategoryId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('name', data.name);
                item.set('parentId', data.parentId);
                item.save();
                resolve();
            });
        });
    },
    getArticleCategory(options){
        let query = new av.Query(articleCategory);
        let limit = options.limit || 20;
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        if (options.name) {
            query.equalTo('name', options.name);
        }
        query.limit(limit);
        query['descending']('articleCategoryId');
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
    getArticleCategoryByArticleCategoryId(articleCategoryId) {
        let query = new av.Query(articleCategory);
        query.equalTo('articleCategoryId', articleCategoryId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    }
};