'use strict';

let leanAppHeader = window.leanAppHeader;
let utils = require('../common/utils');

module.exports = {

    indexFun:function() {
        //选择产品分类
        {
            let category1 = $('.select-category-1');
            let category2 = $('.select-category-2');
            let order = $('.select-order');
            let productMethod = $('.select-product-method');
            let onsale = $('input[name=onsale]');
            
            let category1Val = category1.val();
            let category2Val = category2.val();
            let productMethodVal = productMethod.val();
            let onsaleVal = onsale.val();
            let isShortStock = $('input[name=is-short-stock]').val();
            let updateStockDate = $('input[name=update-stock-date]').val();
            let isUpdateStock = $('input[name=is-update-stock]').val();
            let hot = $('input[name=hot]').val();
            let stock = $('input[name=stock]').val();
            let search = $('input[name=search]').val();
            let isTranslation = $('input[name=is-translation]').val();
            let isSales = $('input[name=is-sales]').val();
            productMethod.change(function(){
                if(this.value) {
                    return location.href = utils.urlParamsComponent('/admin/product',{
                        'product-method-id':this.value,
                        'onsale':onsaleVal,
                        'is-short-stock':isShortStock,
                        'update-stock-date':updateStockDate,
                        'is-update-stock':isUpdateStock,
                        hot,
                        stock,
                        search,
                        'is-translation':isTranslation,
                        'is-sales': isSales
                    });
                }
                location.href = utils.urlParamsComponent('/admin/product',{
                    'onsale':onsaleVal,
                    'is-short-stock':isShortStock,
                    'update-stock-date':updateStockDate,
                    'is-update-stock':isUpdateStock,
                    hot,
                    stock,
                    search,
                    'is-translation':isTranslation,
                    'is-sales': isSales
                });
            });

            category1.change(function() {
                if(this.value) {
                    return location.href = utils.urlParamsComponent('/admin/product',{
                        'product-method-id':productMethodVal,
                        'category1-id':this.value,
                        'onsale':onsaleVal,
                        'is-short-stock':isShortStock,
                        'update-stock-date':updateStockDate,
                        'is-update-stock':isUpdateStock,
                        hot,
                        stock,
                        search,
                        'is-translation':isTranslation,
                        'is-sales': isSales
                    });
                }
                location.href = utils.urlParamsComponent('/admin/product',{
                    'product-method-id':productMethodVal,
                    'onsale':onsaleVal,
                    'is-short-stock':isShortStock,
                    'update-stock-date':updateStockDate,
                    'is-update-stock':isUpdateStock,
                    hot,
                    stock,
                    search,
                    'is-translation':isTranslation,
                    'is-sales': isSales
                });
            });

            category2.change(function() {
                if(this.value) {
                    return location.href = utils.urlParamsComponent('/admin/product',{
                        'product-method-id':productMethodVal,
                        'category1-id':category1Val,
                        'category2-id':this.value,
                        'onsale':onsaleVal,
                        'is-short-stock':isShortStock,
                        'update-stock-date':updateStockDate,
                        'is-update-stock':isUpdateStock,
                        hot,
                        stock,
                        search,
                        'is-translation':isTranslation,
                        'is-sales': isSales
                    });
                }
                location.href = utils.urlParamsComponent('/admin/product',{
                    'product-method-id':productMethodVal,
                    'category1-id':category1Val,
                    'onsale':onsaleVal,
                    'is-short-stock':isShortStock,
                    'update-stock-date':updateStockDate,
                    'is-update-stock':isUpdateStock,
                    hot,
                    stock,
                    search,
                    'is-translation':isTranslation,
                    'is-sales': isSales
                });
            });


            onsale.change(function() {
                location.href = utils.urlParamsComponent('/admin/product',{
                    'product-method-id':productMethodVal,
                    'category1-id':category1Val,
                    'category2-id':category2Val,
                    'onsale':this.value,
                    'is-short-stock':isShortStock,
                    'update-stock-date':updateStockDate,
                    'is-update-stock':isUpdateStock,
                    hot,
                    stock,
                    search,
                    'is-translation':isTranslation,
                    'is-sales': isSales
                });
            });

            order.change(function() {
                return location.href = utils.urlParamsComponent('/admin/product',{
                    'product-method-id':productMethodVal,
                    'category1-id':category1Val,
                    'category2-id':category2Val,
                    'onsale':onsaleVal,
                    'is-short-stock':isShortStock,
                    'update-stock-date':updateStockDate,
                    'is-update-stock':isUpdateStock,
                    'order': this.value,
                    hot,
                    stock,
                    search,
                    'is-translation':isTranslation,
                    'is-sales': isSales
                });
            });

            $(function () {
                var productIds = [];
                $('.remove-product').each(function(i) {
                    productIds.push($(this).attr('data-id'));
                });
                $.ajax({
                    type:'get',
                    url:`/admin/product/get-sales`,
                    data:{
                        'product-ids':productIds
                    }
                }).then(data => {
                    let rows = $('table tbody tr');
                    let lastMonthFirstDay = new Date();
                    let lastMonth = lastMonthFirstDay.getMonth();
                    let twoMonth = lastMonth - 1;
                    if (lastMonth == 0) {
                        lastMonth = 12;
                        twoMonth = 11;
                    }
                    if (lastMonth == 1) {
                        twoMonth = 12;
                    }
                    $.each(data.data,(i,n)=> {
                        rows.each(function () {
                            if (n.productId == $(this).attr('data-product-id')) {
                                $(this).find('.title').attr('data-popover-thirty', n.thirty);
                                $(this).find('.title').attr('data-popover-ninety', n.ninety);
                                $(this).find('.title').attr('data-popover-last-month', n.lastMonty);
                                $(this).find('.title').attr('data-popover-two-month', n.twoMonty);
                            }
                        });
                    });
                    rows.each(function() {
                        let title = $(this).find('.title');
                        title.popover({
                            content:`原价: ${title.data('popover-source-price')} | 成本价:￥${title.data('popover-cost-price')} | 定价: ￥${title.data('popover-price')} <br/>30天销量: ${title.data('popover-thirty')} | 90天销量: ${title.data('popover-ninety')} <br/>  ${twoMonth}月份销量: ${title.data('popover-two-month')} | ${lastMonth}月份销量: ${title.data('popover-last-month')}  <br/>总销量: ${title.data('popover-sales')}`,
                            trigger:'hover'
                        });
                    });

                    $('.recommend-purchase').removeAttr('disabled');
                   
                });
            });
        }
        
       
        
        //删除product
        {
            let alert = $('#modal-alert');
            $('.remove-product').click(function() {
                $('#confirm-remove-product').modal({
                    relatedTarget: this,
                    onConfirm: function() {

                        let target = $(this.relatedTarget);
                        let productId = target.attr('data-id');

                        $.ajax({
                            type:'post',
                            url:`/admin/product/remove/${productId}`
                        }).then(()=> {
                            alert.modal({
                                relatedTarget: this,
                                onConfirm:()=> {
                                    let target = $(this.relatedTarget);
                                    target.parents('tr').detach();
                                }
                            }).find('.am-modal-bd').text('删除产品成功!');
                        });
                    },
                    onCancel:()=> { return false; }
                });

                return false;

            });
        }

        {
            $('.am-table').on('mousedown','.am-icon-link',function() {
                $(this).addClass('on');
            });
        }
        
        //编辑定位
        {
            setTimeout(function () {
                if(/product-id=\d+/.test(location.search)) {
                    let editProductId = /product-id=(\d+)/.exec(location.search)[1];
                    let item = $(`tr[data-product-id=${editProductId}]`);
                    item.addClass('on');
                    $('html,body').animate({'scrollTop':item.offset().top});
                }
            },0);
        }
        
        
        //modal viewport iframe
        {
            let modalViewport = $('#modal-viewport');
            let modalViewportContent = modalViewport.find('.am-modal-bd');
            
            $('.link-modal-viewport').click(function() {
                modalViewportContent.append('<iframe class="iframe-viewport" src="" frameborder="0"></iframe>');
                let iframe = modalViewport.find('iframe');
                let src = $(this).attr('href');
                iframe.attr('src',src);
                modalViewport.modal({
                    width:800,
                    height:520
                });
                return false;
            });

            modalViewport.on('close.modal.amui', function(){
                modalViewportContent.empty();
            });
        }
        
        
        //copy product content
        {
            let form = $('.form-copy-product-content');
            let modalConfirm = $('#modal-confirm');
            let modalAlert = $('#modal-alert');
            
            form.find('.am-btn').click(function() {
                
                let productId = parseInt($(this).parents('tr').data('product-id'));

                if(form.serialize() ==='') {
                    modalAlert.modal({
                        relatedTarget: this
                    }).find('.am-modal-bd').text('请选择需要复制的内容');
                    return false;
                }

                let data = [];
                form.find('input[type=checkbox]:checked').each(function() {
                    data.push(this.name);
                });
                
                modalConfirm.modal({
                    relatedTarget:this,
                    onConfirm: function() {
                        $.ajax({
                            url: '/admin/product/product-copy',
                            type: 'post',
                            data: {
                                productId: productId,
                                field: data
                            }
                        }).then(data => {
                            if(data.success) {
                                modalAlert.modal({
                                    relatedTarget: this,
                                    onConfirm: function() {
                                        location.reload();   
                                    }
                                }).find('.am-modal-bd').text('复制成功!');
                            }
                        });
                    }
                });
                
            });
        }
        
        
        //copy etsy
        {
            
            let modal = $('#modal-copy-etsy');
            let input = $('.input-copy-etsy');
            let modalLoading = $('#modal-loading');
            
            
            $('.link-copy-etsy').click(function() {
                let productId = $(this).data('product-id');
                modalLoading.find('.am-modal-hd').text('正在导入...');
                modal.modal({
                    relatedTarget: this,
                    onConfirm: function(e) {
                        
                        if(!$.trim(input.val()) || $.trim(input.val()).indexOf('etsy.com') ===-1) {
                            alert('请输入正确的etsy.com链接');
                            return;
                        }
                        
                        $.ajax({
                            url:'/admin/product/spider-info',
                            data:{
                                'product-id':productId,
                                'url':$.trim(input.val())
                            }
                        }).then(
                            result => {
                                if(result.code) {
                                    modalLoading.find('.am-modal-hd').text('导入成功!正在更新...');
                                    setTimeout(()=> {
                                        location.reload();
                                    },1000);
                                } else {
                                    modalLoading.find('.am-modal-hd').text('导入失败,请重试!');
                                    setTimeout(()=> {
                                        modalLoading.modal('close');
                                    },1000);
                                }
                            },
                            err => {
                                console.info(err);
                                modalLoading.find('.am-modal-hd').text('导入失败,请重试!');
                                setTimeout(()=> {
                                    modalLoading.modal('close');
                                },1000);
                            }
                        );
                        modalLoading.modal();
                        
                    }
                });
                input[0].focus();
                return false;
            });
            
        }

        //关联分类属性
        {
            let modal = $('#modal-bind-category');
            let input = $('.input-bind-category');
            let modalLoading = $('#modal-loading');

            $('.link-bind-category').click(function () {
                let productId = $(this).data('product-id');
                modalLoading.find('.am-modal-hd').text('正在修改...');
                modal.modal({
                    relatedTarget: this,
                    onConfirm: function(e) {
                        $.ajax({
                            type:'post',
                            url:'/admin/product/set-parent-product',
                            data:{
                                'productId':productId,
                                'parentProductId':input.val()
                            }
                        }).then(
                            result => {
                                modalLoading.find('.am-modal-hd').text('关联成功!正在更新...');
                                setTimeout(()=> {
                                    location.reload();
                                },1000);
                            },
                            err => {
                                console.info(err);
                                modalLoading.find('.am-modal-hd').text('关联失败,请重试!');
                                setTimeout(()=> {
                                    modalLoading.modal('close');
                                },1000);
                            }
                        );
                        modalLoading.modal();
                    }
                });
                input[0].focus();
            });
        }

        {// 改价
            let modal = $('#modal-change-price');
            let input = $('.input-change-price');
            let modalLoading = $('#modal-loading');

            $('.link-change-price').click(function() {
                let productId = $(this).data('product-id');
                let category2Id=$(this).data('category2-id');
                modalLoading.find('.am-modal-hd').text('正在修改...');
                modal.modal({
                    relatedTarget: this,
                    onConfirm: function(e) {

                        if(!$.trim(input.val())) {
                            alert('请输入正确的价格');
                            // return;
                        }else{
                            $.ajax({
                                type:'post',
                                url:'/admin/product/sync-price',
                                data:{
                                    'productId':productId,
                                    'price':$.trim(input.val()),
                                    'category2Id':category2Id
                                }
                            }).then(
                                result => {
                                    modalLoading.find('.am-modal-hd').text('修改成功!正在更新...');
                                    setTimeout(()=> {
                                        location.reload();
                                    },1000);
                                },
                                err => {
                                    console.info(err);
                                    modalLoading.find('.am-modal-hd').text('修改失败,请重试!');
                                    setTimeout(()=> {
                                        modalLoading.modal('close');
                                    },1000);
                                }
                            );
                            modalLoading.modal();
                        }
                    }
                });
                input[0].focus();
                return false;
            });

        }
        
        {// 改成本价
            let modal = $('#modal-change-price');
            let input = $('.input-change-price');
            let modalLoading = $('#modal-loading');

            $('.link-change-cost-price').click(function() {
                let productId = $(this).data('product-id');
                let category2Id=$(this).data('category2-id');
                modalLoading.find('.am-modal-hd').text('正在修改...');
                // console.info(productId);
                modal.modal({
                    relatedTarget: this,
                    onConfirm: function(e) {

                        if(!$.trim(input.val())) {
                            alert('请输入正确的价格');
                            // return;
                        }else{
                            $.ajax({
                                type:'post',
                                url:'/admin/product/sync-cost-price',
                                data:{
                                    'productId':productId,
                                    'costPrice':$.trim(input.val()),
                                    'category2Id':category2Id
                                }
                            }).then(
                                result => {
                                    modalLoading.find('.am-modal-hd').text('修改成功!正在更新...');
                                    setTimeout(()=> {
                                        location.reload();
                                    },1000);
                                },
                                err => {
                                    console.info(err);
                                    modalLoading.find('.am-modal-hd').text('修改失败,请重试!');
                                    setTimeout(()=> {
                                        modalLoading.modal('close');
                                    },1000);
                                }
                            );
                            modalLoading.modal();
                        }
                    }
                });
                input[0].focus();
                return false;
            });

        }
        
        //copy title
        {
            $('.copy-product-title').each(function(i,n) {
                let clipboard = new Clipboard(n, {
                    text: function() {
                        return `${$(n).data('text')} {${$(n).data('id')}}`;
                    }
                });
                clipboard.on('success',data => {
                    $(n).addClass('on');
                });
            });
        }
        
        
        {
            $('.image-source-download').click(function() {
                let group = $(this).next();
                let links = group.find('.image-source-value').val().split('\n');
                let id = $(this).data('product-id');
                if(links.length) {
                    $.each(links,function(i,n) {
                        group.append(`<a href="${n}" download>download</a>`);
                    });
                    group.find('a').each(function() {
                        let evObj = document.createEvent('MouseEvents');
                        evObj.initEvent('click', true, false);
                        this.dispatchEvent(evObj);
                    });
                }
            });  
        }
        
        {
            $('.set-onsale').click(function() {
                let isOnsale = $(this).attr('isonsale') === 'true' ? false : true;
                let productId = $(this).parents('tr').data('product-id');
                let title = $(this).parents('tr').find('.title');
                $.ajax({
                    type:'post',
                    url:`/admin/product/set-onsale/${productId}`,
                    data:{isOnsale}
                }).then(data => {
                    if(data.success) {
                        if(isOnsale) {
                            title.removeClass('product-out');
                            $(this).attr('isonsale','true');
                        } else {
                            title.addClass('product-out');
                            $(this).attr('isonsale','false');
                        }
                    }
                });
                
            });
        }

        {
            $('.set-hot').click(function() {
                let isHot = $(this).attr('ishot') === 'true' ? false : true;
                let productId = $(this).parents('tr').data('product-id');
                let title = $(this).parents('tr').find('.title');
                $.ajax({
                    type:'post',
                    url:`/admin/product/set-hot/${productId}`,
                    data:{isHot}
                }).then(data => {
                    if(data.success) {
                        if(isHot) {
                            title.append('<sup class="hot"></sup>');
                            title.addClass('product-hot');
                            $(this).attr('ishot','true');
                        } else {
                            title.find('sup').detach();
                            title.addClass('product-hot');
                            $(this).attr('ishot','false');
                        }
                    }
                });

            });
        }

        {
            $('.set-short-stock').click(function() {
                let isShortStock = $(this).attr('isshortstock') === 'true' ? false : true;
                let productId = $(this).parents('tr').data('product-id');
                $.ajax({
                    type:'post',
                    url:`/admin/product/set-short-stock/${productId}`,
                    data:{isShortStock}
                }).then(data => {
                    if(data.success) {
                        if(isShortStock) {
                            $(this).addClass('on');
                            $(this).attr('isshortstock','true');
                        } else {
                            $(this).removeClass('on');
                            $(this).attr('isshortstock','false');
                        }
                    }
                });

            });
        }

        //重新上架淘宝
        {

            $('.set-update-stock:not(.on)').each(function () {

            });

            $('.update-totaobao-confirm').click(function () {
                let popover = $(this).parent();
                let updateTotaobaoImage = popover.find('.update-totaobao-image');
                let updateTotaobaoTitle = popover.find('.update-totaobao-title');
                let updateTotaobaoContent = popover.find('.update-totaobao-content');
                let updateTotaobaoPrice = popover.find('.update-totaobao-price');
                let updateTotaobaoCategory = popover.find('.update-totaobao-category');

                let productId = $(this).data('product-id');
                let item = $(`tr[data-product-id=${productId}]`).find('.set-update-stock');

                $.ajax({
                    type:'post',
                    url:`/admin/product/set-update-stock/${productId}`,
                    data:{
                        isUpdateStock:true,
                        updateTotaobaoImage:updateTotaobaoImage.prop('checked'),
                        updateTotaobaoTitle:updateTotaobaoTitle.prop('checked'),
                        updateTotaobaoContent:updateTotaobaoContent.prop('checked'),
                        updateTotaobaoPrice:updateTotaobaoPrice.prop('checked'),
                        updateTotaobaoCategory:updateTotaobaoCategory.prop('checked')
                    }
                }).then(data => {
                    if(data.success) {
                        item.addClass('on');
                        item.attr('isupdatestock','true');
                    }
                    item.popover('close');
                });

            });

            $('.set-update-stock.on').click(function() {
                let productId = $(this).parents('tr').data('product-id');
                $.ajax({
                    type:'post',
                    url:`/admin/product/set-update-stock/${productId}`,
                    data:{isUpdateStock:false}
                }).then(data => {
                    if(data.success) {
                        $(this).removeClass('on');
                        $(this).attr('isupdatestock','false');
                    }
                });

               /*
                let isUpdateStock = $(this).attr('isupdatestock') === 'true' ? false : true;
                let productId = $(this).parents('tr').data('product-id');
                $.ajax({
                    type:'post',
                    url:`/admin/product/set-update-stock/${productId}`,
                    data:{isUpdateStock}
                }).then(data => {
                    if(data.success) {
                        if(isUpdateStock) {
                            $(this).addClass('on');
                            $(this).attr('isupdatestock','true');
                        } else {
                            $(this).removeClass('on');
                            $(this).attr('isupdatestock','false');
                        }
                    }
                });
                */
            });
        }


        {
            $('.set-warning-stock.on').click(function() {
                let productId = $(this).parents('tr').data('product-id');
                $.ajax({
                    type:'post',
                    url:`/admin/product/set-update-stock-date/${productId}`,
                    data:{
                        updateStockDate:true
                    }
                }).then(data => {
                    if(data.success) {
                        $(this).removeClass('on');
                    }
                });
            });
        }

        //促销折扣
        {
            $('.set-discount').click(function() {

                let state = parseInt($(this).attr('data-state'));
                if(state===0) {
                    state = 1;
                } else if(state === 1) {
                    state = 2;
                } else if (state === 2) {
                    state = 3;
                } else if (state === 3) {
                    state = 0;
                }

                let productId = $(this).parents('tr').data('product-id');

                $.ajax({
                    type:'post',
                    url:`/admin/product/set-is-sales/${productId}`,
                    data:{
                        state:state
                    }
                }).then(data => {

                    $(this).attr('data-state',state);

                    if(state === 1) {
                        $(this).removeClass('on-2').removeClass('on-3').addClass('on-1');
                    } else if (state === 2) {
                        $(this).removeClass('on-1').removeClass('on-3').addClass('on-2');
                    } else if(state === 3) {
                        $(this).removeClass('on-1').removeClass('on-2').addClass('on-3');
                    } else if(state === 0) {
                        $(this).removeClass('on-1').removeClass('on-2').removeClass('on-3');
                    }

                });
            });
        }

        {
            $('.set-product-trans').click(function() {
                let isTranslation = $(this).attr('istranslationdate') === 'true' ? false : true;

                let productId = $(this).parents('tr').data('product-id');
                 $.ajax({
                        type:'post',
                        url:`/admin/product/set-is-translation/${productId}`,
                    data:{
                        isTranslation
                    }
                }).then(data => {
                    if(isTranslation) {
                        $(this).addClass('on');
                        $(this).attr('istranslationdate','true');
                    } else {
                        $(this).removeClass('on');
                        $(this).attr('istranslationdate','false');
                    }
                });
            });
        }
        {
            $('.set-product-parent').click(function() {
                window.location.href = '/admin/product?parent-product-id='+$(this).attr('parentProductId');
            });
        }

        //显示规格
        {

            $('.set-product-parent').each(function () {
                 let row = $(this).parents('tr');
                 if(row.hasClass('main-product-row')) {
                     return;
                 }
                 let parentId = parseInt($(this).attr('parentproductid'));
                 let parentTargetRow = $('.main-product-row[data-product-id='+ parentId + ']');
                 if(parentTargetRow.length) {
                     row.addClass('sub-product-row');
                     parentTargetRow.after(row);
                 } else {
                    // row.detach();
                 }
            });

        }

        //检测check-wisdomproducts-stock
        {

            let noWisdomProductLinks = [];
            $('.purchase-link a').each(function () {
                if($(this).attr('href').indexOf('wisdomproducts.com')> -1) {
                    noWisdomProductLinks.push(true);
                }
            });
            if(!noWisdomProductLinks.length) {
                $('.check-wisdomproducts-stock').prop('disabled',true);
            } else {

                $('.check-wisdomproducts-stock').click(function () {
                    let _this = $(this);
                    let text = $(this).text();
                    $(this).text('检测中...');
                    $('.wisdom-check-info').detach();
                    $(this).prop('disabled',true);
                    let linkLength = $('.purchase-link').length;
                    let count = 0;
                    $('.purchase-link a').each(function () {
                        let id = $(this).parent().data('product-id');
                        if($(this).attr('href').indexOf('wisdomproducts.com')> -1) {
                            $.ajax({
                                url:'/admin/product/check-wisdom-products-stock',
                                data:{
                                    productId:id,
                                    url:$(this).attr('href')
                                }
                            }).then((data)=> {
                                count ++;
                                if(linkLength === count) {
                                    _this.prop('disabled',false);
                                    _this.text(text);
                                }
                                let outstock = data.message === '缺货' ? 'outstock' : '';
                                let tr = $(`.am-table tr[data-product-id=${id}]`);
                                tr.find('.product-title').append(`<span class="wisdom-check-info ${outstock}">[${data.message}]</span>`);
                                if(outstock) {
                                    tr.addClass('no-wisdom-stock');
                                }

                            });
                        }
                    });

                });

            }

        }


        //隐藏wisdom缺货项
        {
            //no-wisdom-stock
            let checkbox = $('.hide-wisdomproducts-outstock');
            if($.cookie('hide-wisdomproducts-outstock')) {
                checkbox.prop('checked',true);
                $('#product-list').addClass('hide-no-wisdom');
            }

            checkbox.click(function () {
                if(this.checked) {
                    $.cookie('hide-wisdomproducts-outstock','true',{expires:new Date(new Date().getTime() + 1000*60*60*24*365),path:'/',domain:location.host});
                    $('#product-list').addClass('hide-no-wisdom');
                } else {
                    $.cookie('hide-wisdomproducts-outstock','',{expires:new Date(new Date().getTime()),path:'/',domain:location.host});
                    $('#product-list').removeClass('hide-no-wisdom');
                }
            });
        }

        //推荐购买数
        {
            $('.recommend-purchase').click(function () {

                $('.recommend-purchase-info').detach();
                $('.product-row').each(function (i, n) {

                   let dataThirty = parseInt($(n).find('.title').attr('data-popover-thirty')); //30天销量
                   let dataNinety = parseInt($(n).find('.title').attr('data-popover-ninety'));  //90天销量
                   let dataLastMonth = parseInt($(n).find('.title').attr('data-popover-last-month')); //上月销量
                   let dataLastTowMonth = parseInt($(n).find('.title').attr('data-popover-two-month')); //上上月销量
                   let dataAll = parseInt($(n).find('.title').attr('data-popover-sales')); //总销量
                   let stock = parseInt($(n).find('.am-icon-inbox .stock-num').text()); //当前库存
                   let reserve = parseInt($(n).find('.am-icon-arrow-circle-o-down .stock-num').text()) || 0;
                   let totalMonth = 0;  //从上架到目前的总月份
                    {
                        let createTime = parseInt($(n).find('.title').attr('data-createdate'));
                        let createYear = new Date(createTime).getFullYear();
                        let createMonth = new Date(createTime).getMonth() + 1;
                        let currentYear = new Date().getFullYear();
                        let currentMonth = new Date().getMonth() + 1;
                        totalMonth = (currentYear - createYear) * 12 + (currentMonth - createMonth);
                    }

                    console.log(totalMonth);

                   let currentStock = stock + reserve;
                   let maxSales = Math.max.apply(null,[dataThirty, parseInt(dataNinety/3), dataLastMonth ,dataLastTowMonth]); //取最大30天销量值

                   //计算结果：
                    let reserveNums = maxSales * 3 - currentStock;
                    if(reserveNums <= 0) {
                        reserveNums = '';
                    } else {
                        reserveNums = Math.ceil(reserveNums);
                        reserveNums = '<strong>[推荐预定数:' + reserveNums + ']</strong>';
                    }
                   $(n).find('.product-title').append(`<span class="recommend-purchase-info">${reserveNums}</span>`);
               })
            });
        }

        //如果搜索结果只有一条且是有规格产品，则跳转展示整个产品
        {
            if($('.set-product-parent').length ===1 && $('.am-table').find('tbody tr').length ===1) {
                $(".set-product-parent").click();
            }
        }

    },

    addFun:function() {

        this.setCategory();
        this.chooseBanner('add');
        this.submitControl();
        this.setImageList();
        this.setZclip();
        this.saveData();
    },
    editFun:function() {

        this.setCategory();
        this.chooseBanner();
        this.submitControl();
        this.setImageList();
        this.setZclip();
        this.saveData();
    },

    //一级,二级分类选择
    setCategory:function() {

        let categoryGroup = $('.category-group');
        let $btnAddCategory = $('.btn-add-category');
        let _this = this;

        categoryGroup.on('change','.select-product-method',function() {

            let $this = $(this);
            let group = $this.parents('.group');
            let $selectCategory1 = group.find('.select-category-1');
            let $selectCategory2 = group.find('.select-category-2');

            if(!this.value) {
                return false;
            }

            if(_this.isSubmitBtn) {
                return false;
            }

            let productMethodId = parseInt(this.value);

            $.get({
                url:`${leanApp.api}classes/ProductCategory1`,
                headers:leanAppHeader,
                data:`where={"productMethodId":${productMethodId}}`
            }).done(data => {
                $selectCategory1.find('option:not(:first)').detach();
                $selectCategory2.find('option:not(:first)').detach();
                let options = ``;
                $.each(data.results,(i,n)=>{
                    options += `<option value="${n.category1Id}">${n.name}</option>`;
                });
                $selectCategory1.append(options);
            });

        });

        categoryGroup.on('change','.select-category-1',function() {

            let group = $(this).parents('.group');
            let $selectCategory2 = group.find('.select-category-2');

            if(!this.value){
                return false;
            }


            if(_this.isSubmitBtn) {
                return false;
            }

            let category1Id = parseInt(this.value);

            $.get({
                url:leanApp.api + 'classes/ProductCategory2',
                headers:leanAppHeader,
                data:'where={"category1Id":'+ category1Id +'}'
            }).done(data => {
                $selectCategory2.find('option:not(:first)').detach();
                let options = ``;
                $.each(data.results,(i,n)=>{
                    options += `<option value="${n.category2Id}">${n.name}</option>`;
                });
                $selectCategory2.append(options);
            });
        });

        categoryGroup.on('click','.btn-remove-category',function() {
            $(this).parents('.group').detach();
        });

        //添加新category group并初始化
        $btnAddCategory.click(function() {
            let group = $(this).parents('.group');
            let newGroup = group.clone();
            newGroup.find('.am-selected').detach();
            newGroup.find('select').removeAttr('required');
            newGroup.appendTo(categoryGroup);
            newGroup.find('.select-category-1 option:not(:first)').detach();
            newGroup.find('.select-category-2 option:not(:first)').detach();
            newGroup.find('.btn-add-category').removeClass('btn-add-category').addClass('btn-remove-category').text('删除');
            newGroup.find('label').detach();
        });

    },

    //选择banner
    chooseBanner:function(page) {

        let select = $('#select-banner');
        let bannerView = $('.banner-view');
        let banner = $('#banner');
        let selectBannerRandom = $('.select-banner-random');

        select.on('change',function() {
            let src = select.find('option:selected').attr('data-src');
            bannerView.removeClass('hide');
            bannerView.html(`<img width="300" src="${src}"/>`);
            banner.val(src);
        });

        selectBannerRandom.click(function() {
            let bannerRange = Math.floor(Math.random() * ( select.find('option').length -1 ));
            select.find('option').get(bannerRange).selected = true;
            select.trigger('change');
        });

        if(page==='add') {
            setTimeout(()=> {
                selectBannerRandom.click();
            },1000);
        }

    },
    //设置主图预览
    setImageList:function() {

        let _this = this;
        let imageView = $('.image-list');
        let detailImage = $('#detail-image');

        imageView.on('click','.move',function() {
            let content = $(this).parents('li');
            if(content.index() === 0) {
                return false;
            }
            content.after(content.prev());
            _this.updateMainImage();
        });

        imageView.on('click','.remove',function() {
            let content = $(this).parents('li');

            //自动删除文本框中图片链接
            let imageSrc = content.find('img').attr('src');
            imageSrc = imageSrc.replace('?imageMogr2/thumbnail/100','');
            imageSrc = `![](${imageSrc})`;
            let val = detailImage.val().replace(imageSrc,'');
            detailImage.val($.trim(val));

            content.detach();
            _this.updateMainImage();

        });

        imageView.on('click','input[type=checkbox]',function() {
            _this.updateMainImage();
        });

    },



    //提交时状态设置
    submitControl:function() {

        let submit = $('#submit');
        let _this = this;
        _this.isSubmitBtn =false;

        $('form :submit').click(function() {

            let $this = $(this);
            _this.isSubmitBtn = true;

            $('form').attr({
                'action':$this.data('action'),
                'target':$this.data('target')
            });

            if(this.id === 'submit') {
                $this.data('state',$this[0].id);
            }

            //由于submit时amazeui的select会触发一次onchange,导致category1和category2会重置,数据丢失
            //还原isSubmitBtn,让select enable
            setTimeout(function() {
                _this.isSubmitBtn = false;
                if(this.id === 'submit') {
                    $this.data('state',false);
                }
            }.bind(this),1000);
            return true;
        });


        $('.am-form').validator({
            submit:function() {
                if(!this.isFormValid()){
                    return false;
                }
                if(submit.data('state') === 'submit') {
                    submit.attr('disabled',true).addClass('am-disabled');
                }
            }
        });
    },

    //上传主展示图片callback
    uploadFileSuccess:function(data) {
        let imageView = $('.image-list');
        $.each(data,(i,n)=> {
            imageView.append(`<li data-id="${n.id}" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a class="img-link" href="${n.url}" target="_blank"><img src="${n.url}?imageMogr2/thumbnail/100"/></a></p><p><a class="move" href="javascript:;">前移</a> | <span class="copy"><a class="copy-url" href="javascript:;">复制</a></span> | <a class="remove" href="javascript:;">删除</a></p></div></li>`);
        });
        this.updateMainImage();
    },

    //更新image list
    updateMainImage:function() {

        let image = $('#main-image');
        let imageView = $('.image-list');
        let value = {};

        imageView.find('input[type=checkbox]').each(function() {
            let content = $(this).parents('li');
            value[content.data('id')] = {
                "url":content.find('.img-link').attr('href'),
                "isMainImage":this.checked
            };
        });
        image.val(JSON.stringify(value));

        this.setZclip();

    },

    setZclip:function() {
            let detailImage = $('#detail-image');
            let imageView = $('.image-list');
            $('.zclip').detach();
            imageView.find('.copy-url').detach();

            imageView.find('.copy').append('<a class="copy-url" href="javascript:;">复制</a>');
            imageView.find('.copy-url').each(function() {
                let $this = $(this);
                let clipboard = new Clipboard(this, {
                    text: function() {
                        return `![](${$this.parents('li').find('.img-link').attr('href')})`;
                    }
                });
                clipboard.on('success',data => {
                    imageView.find('.oncopy').removeClass('oncopy');
                    $(this).addClass('oncopy');
                    let detailText = detailImage.val();
                    if(!$.trim(detailText)) {
                        detailImage.val(detailText + data.text);
                    } else {
                        detailImage.val(detailText + '\n' + data.text);
                    }
                });
            });
    },

    saveData:function() {
        $(document).on('keydown',function(e) {
            if(e.keyCode === 13 && e.ctrlKey) {
                $('#submit').click();
            }
        });
    }

};