'use strict';

module.exports = {
    
    uploadFile: function (options) {

        let formUpload = $('#form-upload');
        let file = $('#file');
        let uploadLoading = $('.upload-loading');
        let btn = $('.am-btn');
        let text = $('.text');
        let fileType = options.fileType;
        let callbackName = options.callbackName;
        
        formUpload.submit(function () {
            
            uploadLoading.addClass('on');
            btn.removeClass('am-btn-primary').addClass('am-btn-default').prop('disabled',true);
            text.text('正在上传...');
            file.hide();
            
            $(this).ajaxSubmit({
                data:{fileType:fileType},
                success: function (result) {

                    file.val('');
                    uploadLoading.removeClass('on');
                    btn.addClass('am-btn-primary').removeClass('am-btn-default').prop('disabled',false);
                    text.text('选择要上传的文件');
                    file.show();
                    
                    if (result.success) {
                        window.parent[callbackName](result.data);
                    } else {
                        alert(result.error);
                    }
                    
                }
            });
            
            return false;
        });

        file.change(function () {
            if(this.value) {
                formUpload.submit();
            }
        });

    }
};