'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {
    indexFun:function () {

        let modalOrderSearch = $('.modal-order-search');


        let inputWisdomOrder = $('.input-wisdom-order');
        let inputWisdomValue = $.trim(inputWisdomOrder.val());
        $('.btn-import-wisdom-order').click(function () {
            let arrWisdomData = [];
            let arrValue = inputWisdomValue.split('\n');
            $.each(arrValue,function (i,n) {
                n = n.replace(/\t/g,' ');
                n = n.replace(/\s+/g,' ');
                arrWisdomData.push({
                    name:$.trim(/([^\$]+)\$/.exec(n)[1]),
                    count:/\$[^\s]+\s(\d+)/.exec(n)[1]
                });
            });
            console.log(arrWisdomData);
            $.ajax({
                url:'/input-order/data',
                data:JSON.stringify(arrWisdomData)
            })
        });


        let inputLuckymojoOrder = $('.input-luckymojo-order');
        let inputLuckymojoValue = $.trim(inputLuckymojoOrder.val());
        $('.btn-import-luckymojo-order').click(function () {
            let arrLuckymojoData = [];
            let arrValue = inputLuckymojoValue.split('\n');
            $.each(arrValue,function (i,n) {
                n = n.replace(/\t/g,' ');
                n = n.replace(/\s+/g,' ');
                arrLuckymojoData.push({
                    name:/(\w+\-\w+\-\w+)/.exec(n)[1],
                    count:/(\d+)/.exec(n)[1]
                });
            });
            console.log(arrLuckymojoData);
            $.ajax({
                url:'/input-order/data',
                data:JSON.stringify(arrLuckymojoData)
            })
        });
    }
};