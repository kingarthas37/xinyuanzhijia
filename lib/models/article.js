'use strict';
let tableName = 'Article';
let base = require('../../lib/models/base');
let article, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        article = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    add(data){
        let item = new article();
        return new Promise(function(resolve, reject) {
            item.set('articleCategoryId', data.articleCategoryId);
            item.set('content', data.content);
            item.set('name', data.name);
            item.set('image', data.image);
            item.set('taoBaoLink', data.taoBaoLink);
            item.set('videoLink', data.videoLink);
            item.save().then(item => {
                resolve(item);
            });
        });
    },
    update(data, articleId){
        let query = new av.Query(article);
        query.equalTo('articleId', articleId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('articleCategoryId', data.articleCategoryId);
                item.set('content', data.content);
                item.set('name', data.name);
                item.set('image', data.image);
                item.set('taoBaoLink', data.taoBaoLink);
                item.set('videoLink', data.videoLink);
                item.save();
                resolve();
            });
        });
    },
    getArticle(options){
        let query = new av.Query(article);
        let limit = options.limit || 20;
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        if (options.search) {
            query.equalTo('name', options.search);
        }
        if (options.articleCategoryId) {
            query.equalTo('articleCategoryId', options.articleCategoryId);
        }
        query.limit(limit);
        query['descending']('articleId');
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
    getArticleByArticleId(articleId) {
        let query = new av.Query(article);
        query.equalTo('articleId', articleId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    }
};