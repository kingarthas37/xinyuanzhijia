'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let extend = require('xtend');

let config = require('../../../lib/config');

//class
let courseTemplate = require('../../../lib/models/course-template').createNew();
let base = require('../../../lib/models/base');

let data = extend(config.data, {
    title: `${config.data.titleAdmin} - 添加课程模板`,
    currentTag: 'course-template-add',
    currentPage: 'course-template-add'
});

router.get('/:courseTemplateId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let courseTemplateId = parseInt(req.params.courseTemplateId);
    courseTemplate.getCourseTemplateById().then(result => {
        data = extend(data, {'courseTemplate':result});
        res.render('admin/course-template/edit', data);
    });
});


router.post('/:courseTemplateId', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let courseTemplateId = parseInt(req.params.courseTemplateId);
    let name = req.body['name'];
    let defaultContent = req.body['defaultContent'];
    let defaultName = req.body['defaultName'];
    courseTemplate.update({name, defaultContent, defaultName}, courseTemplateId).then(() => {
        req.flash('success', '添加课程模板成功!');
        res.redirect('/admin/course-template');
    });
});

module.exports = router;