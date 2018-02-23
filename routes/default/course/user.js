'use strict';

let router = require('express').Router();

let async = require('async');
let extend = require('xtend');

let config = require('../../../lib/config');
let course = require('../../../lib/models/course').createNew();
let courseUser = require('../../../lib/models/course-user').createNew();
let AV = require('leanengine');
let pager = require('../../../lib/component/pager');
let flash = require('connect-flash');

let data = extend(config.data, {
    title: `${config.data.name} - 课程报名`,
    headerTitle: '课程报名',
    currentPage: 'course',
    pageType: 'course-user'
});



//首页
router.get('/:courseId', (req, res) => {
    let courseId = parseInt(req.params.courseId);
    data = extend(data, {courseId});
    res.render('default/course/user', data)
});


router.post('/:courseId',(req,res)=> {

    let courseId = parseInt(req.params.courseId);
    let name = req.body['name'];
    let sex = parseInt(req.body['sex']);
    let birthday = req.body['birthday'];
    let wechat = req.body['wechat'];
    course.getCourseByCourseId(courseId).then(item => {
        if (item.get('haveCount') >= item.get('count')) {
            res.send({'code':0, 'message': '本课程人数已满!'});
        } else {
            AV.Promise.when(
                new AV.Promise(resolve => {
                    courseUser.add({courseId, name, sex, birthday, wechat}).then(() => {
                        resolve();
                    });
                }),
                new AV.Promise(resolve => {
                    item.set('haveCount', (item.get('haveCount')+1));
                    item.save();    //更新报名人数
                    resolve();
                })
            ).then(() => { res.send({'code':1, 'message': '报名成功!'}) } );
        }
    });

});

module.exports = router;