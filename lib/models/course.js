'use strict';
let tableName = 'Course';
let base = require('../../lib/models/base');
let course, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        course = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    add(data){
        let item = new course();
        return new Promise(function(resolve, reject) {
            item.set('courseTemplateId', data.courseTemplateId);
            item.set('content', data.content);
            item.set('name', data.name);
            //item.set('startDate', data.startDate);
            item.set('link', data.link);
            item.set('count', data.count);
            item.set('price', data.price);
            item.save();
            resolve();
        });
    },
    update(data, courseId){
        let query = new av.Query(course);
        query.equalTo('courseId', courseId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('courseTemplateId', data.courseTemplateId);
                item.set('countent', data.content);
                item.set('name', data.name);
                //item.set('startDate', data.startDate);
                item.set('link', data.link);
                item.set('count', data.count);
                item.set('price', data.price);
                item.save();
                resolve();
            });
        });
    },
    getCourses(options){
        let query = new av.Query(course);
        let limit = options.limit || 20;
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        query.limit(limit);
        query['descending']('courseId');
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
    getCourseByCourseId(courseId) {
        let query = new av.Query(course);
        query.equalTo('courseId', courseId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    }
};