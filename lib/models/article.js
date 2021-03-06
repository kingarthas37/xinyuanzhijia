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
            item.set('summary', data.summary);
            item.set('name', data.name);
            item.set('image', data.image);
            item.set('taoBaoLink', data.taoBaoLink);
            item.set('videoLink', data.videoLink);
            item.set('detailImages', data.detailImages);
            item.set('attachImages', data.attachImages);
            item.set('status', data.status);
            item.set('weiBoLink', data.weiBoLink);
            item.set('originalLink', data.originalLink);
            item.set('englishName', data.englishName);
            item.set('imageWeitao', data.imageWeitao);
            item.set('tag', data.tag);
            item.set('parentArticleId', data.parentArticleId);
            item.set('isParent', data.isParent);
            item.set('sort', data.sort);
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
                item.set('summary', data.summary);
                item.set('name', data.name);
                item.set('image', data.image);
                item.set('taoBaoLink', data.taoBaoLink);
                item.set('videoLink', data.videoLink);
                item.set('detailImages', data.detailImages);
                item.set('attachImages', data.attachImages);
                item.set('status', data.status);
                item.set('weiBoLink', data.weiBoLink);
                item.set('originalLink', data.originalLink);
                item.set('englishName', data.englishName);
                item.set('imageWeitao', data.imageWeitao);
                item.set('tag', data.tag);
                item.set('parentArticleId', data.parentArticleId);
                item.set('isParent', data.isParent);
                item.set('sort', data.sort);
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
            query.contains('name', options.search);
        }
        if (options.articleCategoryId) {
            query.equalTo('articleCategoryId', options.articleCategoryId);
        }
        if (options.status) {
            query.equalTo('status', options.status);
        }
        if (options.isParent) {
            query.equalTo('isParent', options.isParent);
        }
        if (options.parentArticleId) {
            query.equalTo('parentArticleId', options.parentArticleId);
        }
        if (options.tag) {
            query.equalTo('tag', options.tag);
        }
        if (options.notId) {
            query.notEqualTo('articleId', options.notId);
        }
        query.limit(limit);
        if (options.order) {
            query['descending'](options.order);
        } else {
            query['descending']('createdAt');
        }

        if (options.parentArticleId) {
            query['ascending']('sort');
        }
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
    },
    getNextArticleByArticleId(articleId, limit, isParent, parentArticleId){
        let query = new av.Query(article);
        limit = limit || 1;
        isParent = isParent == false ? isParent : true;
        parentArticleId = parentArticleId == true ? true : false;
        query.greaterThan('articleId', articleId);
        query.equalTo('isParent', isParent);
        if (parentArticleId) {
            query.equalTo('parentArticleId', parentArticleId);
        }
        query.limit(limit);
        return new Promise(function(resolve, reject) {
            query.find().then(item => {
                resolve(item);
            });
        });
    },
    updateArticlePageViews(article) {
        article.set('pageView', (article.get('pageView')+1));
        article.save();
    },
    updateArticleIsParent(isParent, articleId){
        let query = new av.Query(article);
        query.equalTo('articleId', articleId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('isParent', isParent);
                item.save();
                resolve();
            });
        });
    },
    updateArticleApprovalByArticleId(articleId) {
        let query = new av.Query(article);
        query.equalTo('articleId', articleId);
        query.first().then(item => {
            item.set('approval', (item.get('approval')+1));
            item.save();
        });
    },
    updateArticleShareByArticleId(articleId) {
        let query = new av.Query(article);
        query.equalTo('articleId', articleId);
        query.first().then(item => {
            item.set('share', (item.get('share')+1));
            item.save();
        });
    },
};