'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let courseTemplate = require('../../../lib/models/course-template').createNew();
let AV = require('leanengine');
let pager = require('../../../lib/component/pager');
let flash = require('connect-flash');

let data = extend(config.data, {
    title: `${config.data.name} - 课程`,
    currentTag:'course-template',
    currentPage: 'course-template'
});
let base = require('../../../lib/models/base');


//首页
router.get('/', (req, res) => {
    data = extend(data, {
        flash: {success: req.flash('success'), error: req.flash('error')}
    });
    base.isAdminUserLogin(req,res);  //判断是否登录
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let options = {page,limit};
    AV.Promise.when(
        new AV.Promise(resolve => {
            courseTemplate.getCourseTemplates(options).then(result => {
                let count = result.count;
                data = extend(data, {
                    pager: pager.init(page, limit, count),
                    pagerHtml: pager.initHtml({
                        page, limit, count,
                        url: '/admin/course-template',
                        serialize: {
                            page
                        }
                    }),
                    courseTemplate:result.items
                });
                resolve();
            });
        })
    ).then(() => { res.render('admin/course-template', data); });
});


router.post('/remove/:courseTemplateId',(req,res)=> {

    let courseTemplateId = parseInt(req.params.courseTemplateId);

    let query = new AV.Query(Course);
    query.equalTo('courseTemplateId',courseTemplateId);

    query.first().then(item => {
        item.destroy();
    }).then(() => { res.send({success: 1}); });

});

module.exports = router;