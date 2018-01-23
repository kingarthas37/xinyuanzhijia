'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {
    indexFun:function () {

        let modalOrderSearch = $('.modal-order-search');

        let inputWisdomOrder = $('.input-wisdom-order');
        $('.btn-import-wisdom-order').click(function () {
            let arrWisdomData = [];
            let arrValue = $.trim(inputWisdomOrder.val()).split('\n');
            $.each(arrValue,function (i,n) {
                n = n.replace(/\t/g,' ');
                n = n.replace(/\s+/g,' ');
                let name = /([^\$]+)\$/.exec(n)[1];
                name = name.replace(/\d\/\d.*/,'');
                name = $.trim(name);
                arrWisdomData.push({
                    name:name,
                    count:/\$[^\s]+\s(\d+)/.exec(n)[1]
                });
            });
            console.log(arrWisdomData);
            $.ajax({
                url:'/admin/import-order/data',
                type:'post',
                data:{'import-data': JSON.stringify(arrWisdomData)}
            });
        });


        let inputLuckymojoOrder = $('.input-luckymojo-order');
        $('.btn-import-luckymojo-order').click(function () {
            let arrLuckymojoData = [];
            let arrValue = $.trim(inputLuckymojoOrder.val()).split('\n');
            $.each(arrValue,function (i,n) {
                n = n.replace(/\t/g,' ');
                n = n.replace(/\s+/g,' ');
                arrLuckymojoData.push({
                    name:/(\w+\-\w+\-\w+)/.exec(n)[1],
                    count:/(\d+)/.exec(n)[1]
                });
            });
            $.ajax({
                url:'/admin/import-order/data',
                type:'post',
                data:{'import-data': JSON.stringify(arrLuckymojoData)}
            });
        });
    }
};