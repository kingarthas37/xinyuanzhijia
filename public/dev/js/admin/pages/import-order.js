'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');
let async = require('async');

module.exports = {
    indexFun:function () {

        let modalOrderSearch = $('#modal-order-search');
        let modalOrderSearchContent = modalOrderSearch.find('.am-table tbody');

        let inputWisdomOrder = $('.input-wisdom-order');
        $('.btn-import-wisdom-order').click(function () {
            modalOrderSearch.modal();
            modalOrderSearchContent.empty();
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

            let countLen = 1;
            let $countLen = $('.count-len');
            $countLen.text(`${countLen}/${arrWisdomData.length}`);
            async.forEachSeries(arrWisdomData, function(item, callback) {
                $.ajax({
                    url:'/admin/import-order/data',
                    type:'post',
                    data:{'import-data': JSON.stringify([item])}
                }).then(function (data) {
                    $countLen.text(`${countLen}/${arrWisdomData.length}`);
                    countLen ++;
                    let mainImage = 'http://ac-QuiPuWpJ.clouddn.com/0d56f9d95dc6da7edf45.png';
                    for(let i in data.result[0].mainImage) {
                        if(data.result[0].mainImage[i].isMainImage) {
                            mainImage = data.result[0].mainImage[i].url;
                        }
                    }

                    modalOrderSearchContent.append(`<tr>
                        <td class="t-c"><a target="_blank" href="${mainImage}"><img src="${mainImage}?imageMogr2/thumbnail/32" alt=""></a></td>
                        <td>${data.result[0].nameCn}</td>
                        <td class="t-c">${data.result[0].stock}</td>
                        <td class="t-c">${data.result[0].reserve}</td>
                        <td class="t-c"><strong>${data.result[0].count}</strong></td>
                        <td class="t-c"><span class="import-check-true"><i class="am-icon-check"></i> 可导入</span></td>
                    </tr>`);
                    callback();
                });
            }, function(err) {
            });


        });


        let inputLuckymojoOrder = $('.input-luckymojo-order');
        $('.btn-import-luckymojo-order').click(function () {
            modalOrderSearch.modal();
            modalOrderSearchContent.empty();
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
            async.forEachSeries(arrLuckymojoData, function(item, callback) {
                $.ajax({
                    url:'/admin/import-order/data',
                    type:'post',
                    data:{'import-data': JSON.stringify([item])}
                }).then(function (data) {
                    modalOrderSearchContent.append(`<tr>
                        <td>${data.result[0].name}</td>
                        <td>${data.result[0].count}</td>
                    </tr>`);
                    callback();
                });
            }, function(err) {
            });
        });
    }
};