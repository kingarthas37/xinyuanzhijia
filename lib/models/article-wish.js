'use strict';
let tableName = 'ArticleWish';
let base = require('../../lib/models/base');
let articleWish, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        articleWish = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        let extend = base.getExtend();
        this.init();
        return extend(this, base);
    },
    getWishByCommonMemberId(options) {
        let query = new av.Query(articleWish);
        query.equalTo('status', true);
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
    getWishByArticleId(articleId) {
        let query = new av.Query(articleWish);
        query.equalTo('articleId', articleId);
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
    getWishCountByArticleId(articleId) {
        let query = new av.Query(articleWish);
        query.equalTo('articleId', articleId);
        query.equalTo('status', true);
        return new Promise(function(resolve, reject) {
            query.count().then(count=> {
                let data = {'count':count};
                resolve(data);
            });
        });
    },
    getWishByCommonMemberIdAndArticleId(commonMemberId, articleId) {
        let query = new av.Query(articleWish);
        query.equalTo('articleId', articleId);
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
        let articleId = parseInt(datas.articleId);
        let commonMemberId = parseInt(datas.commonMemberId);
        let query = new av.Query(articleWish);
        query.equalTo('articleId', articleId);
        query.equalTo('commonMemberId', commonMemberId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                if(item) {
                    item.set('status', true);
                    item.save();
                    resolve(item);
                } else {
                    let wish = new articleWish();
                    wish.set('articleId', parseInt(datas.articleId));
                    wish.set('commonMemberId', parseInt(datas.commonMemberId));
                    wish.set('status', true);
                    wish.save();
                }
            });
        });


    },
    edit(datas) {
        let articleId = parseInt(datas.articleId);
        let commonMemberId = parseInt(datas.commonMemberId);
        let query = new av.Query(articleWish);
        query.equalTo('articleId', articleId);
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