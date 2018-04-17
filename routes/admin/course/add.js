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
    title: `${config.data.titleAdmin} - 添加课程`,
    currentTag: 'course',
    currentPage: 'course-add'
});

router.get('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    AV.Promise.when(
        new AV.Promise(resolve => {
            courseTemplate.getCourseTemplates({limit: 999}).then(result => {
                data = extend(data, {courseTemplate: result.items});
                resolve();
            });
        })
    ).then(() => { res.render('admin/course/add', data); } );
});


router.post('/', (req, res) => {
    base.isAdminUserLogin(req, res);  //判断是否登录
    let courseTemplateId = parseInt(req.body['courseTemplateId']);
    let content = req.body['content'];
    let name = req.body['name'];
    let startDate = req.body['startDate'];
    let link = req.body['link'] || null;
    let count = parseInt(req.body['count']);
    let price = Math.floor(req.body['price']);
    course.add({courseTemplateId,content,name,startDate,link,count,price}).then(item => {
        let url = 'https://api.weibo.com/2/short_url/shorten.json?source=330275214&url_long='+encodeURI(config.website.domain+'course/detail/'+item.get('courseTemplateId'));
        https.get(url, function(response) {
            var html='';
            response.on('data', function(data) {
                html = data;
            });
            response.on('end',function() {

                item.set('link', html)
                req.flash('success', '添加课程成功!');
                res.redirect('/admin/course');
            });
        }).on('error', function() {
            console.log('error');
            req.flash('success', '添加课程失败!');
            res.redirect('/admin/course');
        });

    });
});

module.exports = router;