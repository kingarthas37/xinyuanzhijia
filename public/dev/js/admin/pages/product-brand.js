'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {

    indexFun: function () {

        //删除productMethod
        let removeLink = $('.remove-product-brand');
        let modal = $('#confirm-remove-product-brand');
        let alert = $('#modal-alert');

        //alert 关闭后移除暂存的实例，再次调用时重新初始化,可以解决2次调用同一代码的问题
        alert.on('closed.modal.amui', function () {
            $(this).removeData('amui.modal');
        });

        removeLink.click(function() {
            
            modal.modal({
                relatedTarget: this,
                onConfirm: function () {

                    let item = $(this.relatedTarget);
                    let productMethodId = parseInt(item.data('id'));

                    if (item.data('state')) {
                        return false;
                    }
 
                    item.data('state', true);
                    $.AMUI.progress.start();

                    $.ajax({
                        type:'post',
                        url:`/admin/product-brand/remove/${productMethodId}`,
                        success: function (data) {
                            
                            item.data('state', false);
                            $.AMUI.progress.done();
                            modal.modal('close');

                            if (data.success) {
                                alert.modal({
                                    onConfirm: ()=> location.reload()
                                }).find('.am-modal-bd').text('删除产品类型成功!');
                            } else {
                                alert.modal().find('.am-modal-bd').text(data.message);
                            }
                        }
                        
                    });

                    return false;
                }
            });
            
        });

    },
    addFun: function () {
        this.submitControl();
    },
    editFun: function () {
        this.submitControl();
    },
    submitControl: function () {
        let submit = $('#submit');
        $('.am-form').validator({
            submit: function () {
                if (!this.isFormValid()) {
                    return false;
                }
                submit.attr('disabled', true).addClass('am-disabled');
            }
        });
    },
    brandLogoUploadSuccess(data) {
        $('#brand-logo-image-view').empty().addClass('on').append(`<li><a href="${data[0].url}"><img src="${data[0].url}"/></a></li>`);
        $('#brand-logo-image').val(data[0].url);
    },
    authorUploadSuccess(data) {
        $('#author-image-view').empty().addClass('on').append(`<li><a href="${data[0].url}"><img src="${data[0].url}"/></a></li>`);
        $('#author-image').val(data[0].url);
    },
    imageUploadSuccess(data) {
        let detailText = $('#brand-detail');
        let text = detailText.val();
        text += `\n\n${data[0].url}`;
        detailText.val(text);
    }
};