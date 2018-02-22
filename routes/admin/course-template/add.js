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

router.get('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    res.render('admin/course-template/add', data);
});


router.post('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let name = req.body['name'];
    let defaultContent = req.body['defaultContent'];
    let defaultName = req.body['defaultName'];
    courseTemplate.add({name, defaultContent, defaultName}).then(() => {
        req.flash('success', '添加课程模板成功!');
        res.redirect('/admin/course-template');
    });
});

module.exports = router;