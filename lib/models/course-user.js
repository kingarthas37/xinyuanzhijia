'use strict';
let tableName = 'Course';
let base = require('../../lib/models/base');
let courseUser, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        courseUser = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    add(data){
        let item = new courseUser();
        return new Promise(function(resolve, reject) {
            item.set('courseId', data.courseId);
            item.set('name', data.name);
            item.set('sex', data.sex);
            item.set('birthday', data.birthday);
            item.set('wechat', data.wechat);
            item.save();
            resolve();
        });
    },
    update(data, courseUserId){
        let query = new av.Query(courseUser);
        query.equalTo('courseUserId', courseUserId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('courseId', data.courseId);
                item.set('name', data.name);
                item.set('sex', data.sex);
                item.set('birthday', data.birthday);
                item.set('wechat', data.wechat);
                item.set('isPay', data.isPay);
                item.save();
                resolve();
            });
        });
    },
    getCourseUsers(options){
        let query = new av.Query(courseUser);
        let limit = options.limit || 20;
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        if (options.courseId) {
            query.equalTo('courseId', options.courseId);
        }
        query.limit(limit);
        query['descending']('courseUserId');
        return new Promise(function(resolve, reject) {
            query.count().then(count=> {
                let data = {'count':count, 'items': null};
                if (count > 0) {
                    query.find().then(items=> {
                        items.forEach(n => {
                            let sex = '';
                            if (n.get('sex') == 0) {
                                sex =  '男';
                            } else if (n.get('sex') == 1) {
                                sex =  '女';
                            }
                            n.set('sex', sex);
                            let isPay = '未付款';
                            if (n.get('isPay')) {
                                isPay = '已付款';
                            }
                            n.set('isPay', isPay);
                        });
                        data = extend(data, {'items': items});
                        resolve(data);
                    });
                } else {
                    resolve(data);
                }
            });
        });
    }
};