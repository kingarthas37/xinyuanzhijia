'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');
let async = require('async');

module.exports = {
    indexFun:function () {

        this.modalOrderSearch = $('#modal-order-search');
        this.modalOrderSearchContent = this.modalOrderSearch.find('.am-table tbody');
        this.countLen = this.modalOrderSearch.find('.count-len');
        this.btnImportOrder = this.modalOrderSearch.find('.btn-import-order');

        this.setWisdomOrderSite();
        this.setLuckymojoOrderSite();




        $('.btn-import-order').click(function () {
            if(confirm('确定进行批量设置?')) {

            }
        });

    },
    setWisdomOrderSite() {

        let _this = this;
        let inputWisdomOrder = $('.input-wisdom-order');
        $('.btn-import-wisdom-order').click(function () {
            _this.modalOrderSearch.modal();
            _this.modalOrderSearchContent.empty();
            _this.countLen.text('');
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
            _this.countLen.text(`${countLen}/${arrWisdomData.length}`);
            async.forEachSeries(arrWisdomData, function(item, callback) {
                $.ajax({
                    url:'/admin/import-order/data',
                    type:'post',
                    data:{'import-data': JSON.stringify([item])}
                }).then(function (data) {
                    _this.appendData(data,countLen,arrWisdomData,callback);
                });
            }, function(err) {
            });


        });
    },
    setLuckymojoOrderSite() {
        let _this = this;
        let inputLuckymojoOrder = $('.input-luckymojo-order');

        $('.btn-import-luckymojo-order').click(function () {
            _this.modalOrderSearch.modal();
            _this.modalOrderSearchContent.empty();
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
            let countLen = 1;
            _this.countLen.text(`${countLen}/${arrLuckymojoData.length}`);
            async.forEachSeries(arrLuckymojoData, function(item, callback) {
                $.ajax({
                    url:'/admin/import-order/data',
                    type:'post',
                    data:{'import-data': JSON.stringify([item])}
                }).then(function (data) {
                    _this.appendData(data,countLen,arrLuckymojoData,callback);
                });
            }, function(err) {
            });
        });
    },
    appendData(data,_countLen,arrData,callback) {
        let _this = this;
        let countLen = _countLen;
        _this.countLen.text(`${countLen}/${arrData.length}`);
        countLen ++;
        let mainImage = 'http://ac-QuiPuWpJ.clouddn.com/0d56f9d95dc6da7edf45.png';
        for(let i in data.result[0].mainImage) {
            if(data.result[0].mainImage[i].isMainImage) {
                mainImage = data.result[0].mainImage[i].url;
            }
        }

        let nameCn = data.result[0].nameCn === '' ? '-' : data.result[0].nameCn;
        let stock = data.result[0].stock === '' ? '-' : data.result[0].stock;
        let reserve = data.result[0].reserve === '' ? '-' : data.result[0].reserve;
        let isImportTrue = data.result[0].isTrue ? '<span class="import-check-true"><i class="am-icon-check"></i></span>' : '<span class="import-check-false"><i class="am-icon-close"></i></span>';

        _this.modalOrderSearchContent.append(`<tr>
                        <td class="t-c"><a target="_blank" href="${mainImage}"><img src="${mainImage}?imageMogr2/thumbnail/32" alt=""></a></td>
                        <td>[${data.result[0].name}]<br/>${nameCn}</td>
                        <td class="t-c">${stock}</td>
                        <td class="t-c">${reserve}</td>
                        <td class="t-c"><strong>${data.result[0].count}</strong></td>
                        <td class="t-c">${isImportTrue}</td>
                    </tr>`);
        callback();
    }
};