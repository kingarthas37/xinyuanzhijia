'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let course = require('../../../lib/models/course').createNew();
let AV = require('leanengine');
let pager = require('../../../lib/component/pager');
let flash = require('connect-flash');

let data = extend(config.data, {
    title: `${config.data.name} - 历史课程`,
    headerTitle: '历史课程',
    currentPage: 'course',
    pageType: 'course'
});



//首页
router.get('/', (req, res) => {
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let options = {page,limit};
    AV.Promise.when(
        new AV.Promise(resolve => {
            course.getCourses(options).then(result => {
                let count = result.count;
                data = extend(data, {
                    pager: pager.init(page, limit, count),
                    pagerHtml: pager.initHtml({
                        page, limit, count,
                        url: '/admin/course',
                        serialize: {
                            page
                        }
                    }),
                    course:result.items
                });
                resolve(data);
            });
        })
    ).then(() => { res.render('default/course', data); } );
});


router.get('/detail/:courseId',(req,res)=> {

    let courseId = parseInt(req.params.courseId);

    course.getCourseByCourseId(courseId).then(item => {
        data = extend(data, {course:item});
        res.render('default/course/detail', data);
    });

});

module.exports = router;