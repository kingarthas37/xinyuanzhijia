'use strict';
let tableName = 'CourseTemplate';
let base = require('../../lib/models/base');
let courseTemplate, av, extend, config;
module.exports = {
    init() {
        extend = base.getExtend();
        courseTemplate = base.getObject(tableName);
        av = base.getAV();
        config = base.getConfig();
    },
    createNew(){
        this.init();
        return extend(this, base);
    },
    add(data){
        let item = new courseTemplate();
        return new Promise(function(resolve, reject) {
            item.set('defaultContent', data.defaultContent);
            item.set('defaultName', data.defaultName);
            item.set('name', data.name);
            item.save();
            resolve();
        });
    },
    update(data, courseTemplateId){
        let query = new av.Query(courseTemplate);
        query.equalTo('courseTemplateId', courseTemplateId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                item.set('defaultContent', data.defaultContent);
                item.set('defaultName', data.defaultName);
                item.set('name', data.name);
                item.save();
                resolve();
            });
        });
    },
    getCourseTemplates(options){
        let query = new av.Query(courseTemplate);
        let limit = options.limit || 20;
        if (options.page) {
            query.skip((options.page - 1) * options.limit);
        }
        query.limit(limit);
        query['descending']('courseTemplateId');
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
    getCourseTemplateById(courseTemplateId) {
        let query = new av.Query(courseTemplate);
        query.equalTo('courseTemplateId', courseTemplateId);
        return new Promise(function(resolve, reject) {
            query.first().then(item => {
                resolve(item);
            });
        });
    }
};