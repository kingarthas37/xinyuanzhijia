'use strict';

let router = require('express').Router();
let AV = require('leanengine');

let flash = require('connect-flash');

let async = require('async');
let extend = require("xtend");

let config = require('../../../lib/config');

//class
let Earning = AV.Object.extend('Earning');

let data =  extend(config.data,{
    title:'采购账单统计',
    currentPage:'spent'
});
let base = require('../../../lib/models/base');



//首页
router.get('/', function (req, res) {

    base.isAdminUserLogin(req, res);  //判断是否登录

    var currentDate = new Date();

    var searchMonth = req.query['search-month'];
    if(searchMonth) {
        currentDate = new Date(searchMonth);
    }

    //当月天数
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentMonthDays = (function() {
        return (new Date(currentDate.getFullYear(),(currentDate.getMonth() + 1),0)).getDate();
    })();

    data = extend(data,{
        flash: {
            success:req.flash('success'),
            error:req.flash('error')
        },
        user:req.currentUser,
        currentDate:currentDate,
        currentMonthDays:currentMonthDays
    });

    var query = new AV.Query(Earning);

    //查询一个月之内的条件
    query.greaterThan('date',new Date(currentYear,currentMonth,0));
    query.lessThanOrEqualTo('date',new Date(currentYear,currentMonth + 1,0));
    query.find().then(function(results) {

        var _results = [];

        for(var i=0;i<results.length;i++) {
            _results[ results[i].get('date').getDate() -1 ] = results[i];
        }

        data = extend(data,{
            spent:_results
        });
        return res.render('order/spent',data);
    });

});

module.exports = router;