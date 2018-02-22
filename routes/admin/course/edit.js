'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let course = require('../../../lib/models/course').createNew();
let courseTemplate = require('../../../lib/models/course-template').createNew();
let base = require('../../../lib/models/base');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 修改课程`,
    currentTag: 'course',
    currentPage: 'course-add'
});

router.get('/:courseId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let courseId = parseInt(req.params.courseId);
    AV.Promise.when(
        new AV.Promise(resolve => {
            courseTemplate.getCourseTemplates({limit: 999}).then(result => {
                data = extend(data, {courseTemplate: result.items});
                resolve(data);
            });
        }),
        new AV.Promise(resolve => {
            course.getCourseByCourseId(courseId).then(item => {
                data = extend(data, {course: item});
                resolve(data);
            });
        })
    ).then(() => res.render('admin/course/edit', data));
});


router.post('/:courseId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let courseId = parseInt(req.params.courseId);
    let courseTemplateId = parseInt(req.body['courseTemplateId']);
    let countent = req.body['countent'];
    let name = req.body['name'];
    let startDate = req.body['startDate'];
    let link = req.body['link'];
    let count = req.body['count'];
    let price = req.body['price'];
    course.update({courseTemplateId,countent,name,startDate,link,count,price}, courseId).then(() => {
        req.flash('success', '修改课程成功!');
        res.redirect('/admin/course');
    });
});

module.exports = router;