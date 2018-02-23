'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let courseUser = require('../../../lib/models/course-user').createNew();
let AV = require('leanengine');
let pager = require('../../../lib/component/pager');
let flash = require('connect-flash');

let data = extend(config.data, {
    title: `${config.data.name} - 课程`,
    currentTag:'tools',
    currentPage: 'import-order'
});
let base = require('../../../lib/models/base');


//首页
router.get('/', (req, res) => {

    base.isAdminUserLogin(req,res);  //判断是否登录
    let courseId = req.query['course-id'] ? parseInt(req.query['course-id']) : '';
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let limit = req.query.limit ? parseInt(req.query.limit) : config.page.limit;
    let options = {page, limit, courseId};
    AV.Promise.when(
        new AV.Promise(resolve => {
            courseUser.getCourseUsers(options).then(result => {
                let count = result.count;
                data = extend(data, {
                    pager: pager.init(page, limit, count),
                    pagerHtml: pager.initHtml({
                        page, limit, count,
                        url: '/admin/course-user',
                        serialize: {
                            page,
                            'course-id':courseId
                        }
                    }),
                    courseUser:result.items
                });
                resolve();
            });
        })
    ).then(() => { res.render('admin/course-user', data); } );
});


module.exports = router;