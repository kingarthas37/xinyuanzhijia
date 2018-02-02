'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');
let async = require('async');

module.exports = {
    indexFun:function () {

        let _this = this;
        this.modalOrderSearch = $('#modal-order-search');
        this.modalOrderSearchContent = this.modalOrderSearch.find('.am-table tbody');
        this.countLen = this.modalOrderSearch.find('.count-len');
        this.btnImportOrder = this.modalOrderSearch.find('.btn-import-order');

        this.setWisdomOrderSite();
        this.setLuckymojoOrderSite();
        this.setProductOrderSite();

        //正在导入标记
        this.isImporting = false;

        this.btnImportOrder.click(()=> {

            let arr = [];
            this.modalOrderSearchContent.find('tr').each(function (i,n) {
                if($(n).attr('data-product-id')) {
                    arr.push({
                        productId:$(n).data('product-id'),
                        reserve:$(n).data('reserve'),
                        newReserve:$(n).data('count')
                    });
                }
            });

            if(confirm('确定进行批量设置?')) {
                _this.isImporting = true;
                $(_this.btnImportOrder).attr('disabled','disabled');
                async.forEachSeries(arr, function(item, callback) {
                    $.ajax({
                        url:'/admin/import-order/save-data',
                        type:'post',
                        data:{
                            productId:item.productId,
                            reserve:item.reserve,
                            newReserve:item.newReserve
                        }
                    }).then(function () {
                        let tr = _this.modalOrderSearchContent.find(`tr[data-product-id=${item.productId}]`);
                        tr.find('.import-check-true').removeClass('import-check-true').addClass('import-check-success');
                        tr.find('.update-reserve').addClass('on');
                        callback();
                    });
                }, function(err) {
                    if(err) {
                        alert(arr);
                        return false;
                    }
                    setTimeout(function () {
                        _this.isImporting = false;
                        alert('批量更新完成!');
                    },1000);
                });

            }
        });

        this.modalOrderSearch.on('open.modal.amui', function(){
            $(_this.btnImportOrder).attr('disabled','disabled');
        });

        $('.btn-save-text').click(function () {
           let content = $(this).parents('.content');
           let text = $.trim(content.find('textarea').val());
         //   text = text.replace(/\t/g,' ');
          //  text = text.replace(/\s+/g,' ');
            $.cookie(content.find('textarea').attr('class'),text,{expires:new Date(new Date().getTime() + 1000*60*60*24*30),path:'/',domain:location.host});
            setTimeout(function () {
                location.reload();
            },500);
        });

    },
    setWisdomOrderSite() {

        let _this = this;
        let inputWisdomOrder = $('.input-wisdom-order');
        $('.btn-import-wisdom-order').click(function () {

            if(_this.isImporting) {
                alert('正在导入中，请稍后...');
                return false;
            }

            _this.isImporting = true;
            _this.modalOrderSearch.modal();
            _this.modalOrderSearchContent.empty();
            $(_this.btnImportOrder).attr('disabled','disabled');
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

            let countLen = 0;
            _this.countLen.text(`${countLen}/${arrWisdomData.length}`);
            async.forEachSeries(arrWisdomData, function(item, callback) {
                $.ajax({
                    url:'/admin/import-order/data',
                    type:'post',
                    data:{'import-data': JSON.stringify([item])}
                }).then(function (data) {
                    if(countLen < arrWisdomData.length) {
                        countLen ++;
                    }
                    if(countLen === arrWisdomData.length) {
                        $(_this.btnImportOrder).removeAttr('disabled');
                    }
                    _this.appendData(data,countLen,arrWisdomData,callback);
                });
            }, function(err) {
                _this.isImporting = false;
            });

        });

        if($.cookie('input-wisdom-order')) {
            $('.input-wisdom-order').val($.cookie('input-wisdom-order'));
        }

    },
    setLuckymojoOrderSite() {
        let _this = this;
        let inputLuckymojoOrder = $('.input-luckymojo-order');

        $('.btn-import-luckymojo-order').click(function () {

            if(_this.isImporting) {
                alert('正在导入中，请稍后...');
                return false;
            }

            _this.isImporting = true;
            _this.modalOrderSearch.modal();
            _this.modalOrderSearchContent.empty();
            $(_this.btnImportOrder).attr('disabled','disabled');
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
            let countLen = 0;
            _this.countLen.text(`${countLen}/${arrLuckymojoData.length}`);
            async.forEachSeries(arrLuckymojoData, function(item, callback) {
                $.ajax({
                    url:'/admin/import-order/data',
                    type:'post',
                    data:{'import-data': JSON.stringify([item])}
                }).then(function (data) {
                    if(countLen < arrLuckymojoData.length) {
                        countLen ++;
                    }
                    if(countLen === arrLuckymojoData.length) {
                        $(_this.btnImportOrder).removeAttr('disabled');
                    }
                    _this.appendData(data,countLen,arrLuckymojoData,callback);
                });
            }, function(err) {
                _this.isImporting = false;
            });
        });

        if($.cookie('input-luckymojo-order')) {
            $('.input-luckymojo-order').val($.cookie('input-luckymojo-order'));
        }
    },
    setProductOrderSite() {

        let _this = this;
        let inputProductOrder = $('.input-product-order');

        $('.btn-import-product-order').click(function () {

            if(_this.isImporting) {
                alert('正在导入中，请稍后...');
                return false;
            }

            _this.isImporting = true;
            _this.modalOrderSearch.modal();
            _this.modalOrderSearchContent.empty();
            $(_this.btnImportOrder).attr('disabled','disabled');
            let arrProductData = [];
            let arrValue = $.trim(inputProductOrder.val()).split('\n');
            $.each(arrValue,function (i,n) {
                n = n.replace(/\t/g,' ');
                n = n.replace(/\s+/g,' ');
                n = n.toUpperCase();
                arrProductData.push({
                    name:$.trim(/([^\*]+)/.exec(n)[1]),
                    count:/\*\s?(\d+)/.exec(n)[1]
                });
            });
            let countLen = 0;
            _this.countLen.text(`${countLen}/${arrProductData.length}`);
            async.forEachSeries(arrProductData, function(item, callback) {
                $.ajax({
                    url:'/admin/import-order/data',
                    type:'post',
                    data:{'import-data': JSON.stringify([item])}
                }).then(function (data) {
                    if(countLen < arrProductData.length) {
                        countLen ++;
                    }
                    if(countLen === arrProductData.length) {
                        $(_this.btnImportOrder).removeAttr('disabled');
                    }
                    _this.appendData(data,countLen,arrProductData,callback);
                });
            }, function(err) {
                _this.isImporting = false;
            });
        });

        if($.cookie('input-product-order')) {
            $('.input-product-order').val($.cookie('input-product-order'));
        }

    },

    appendData(data,_countLen,arrData,callback) {
        let _this = this;
        _this.countLen.text(`${_countLen}/${arrData.length}`);
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

        _this.modalOrderSearchContent.append(`<tr data-product-id="${data.result[0].productId}" data-reserve="${reserve}" data-count="${data.result[0].count}">
                        <td class="t-c"><a target="_blank" href="${mainImage}"><img src="${mainImage}?imageMogr2/thumbnail/32" alt=""></a></td>
                        <td>[${data.result[0].name}]<br/>${nameCn}</td>
                        <td class="t-c">${stock}</td>
                        <td class="t-c">${reserve}</td>
                        <td class="t-c"><strong>${data.result[0].count}</strong></td>
                        <td class="t-c"><i class="update-reserve">${ reserve=== '-' ? '-' :(parseInt(reserve) + parseInt(data.result[0].count))}</i></td>
                        <td class="t-c">${isImportTrue}</td>
                    </tr>`);
        callback();
    }
};