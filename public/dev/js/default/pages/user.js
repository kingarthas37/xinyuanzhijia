'use strict';

module.exports = {

    loginFun() {
        
        let form = $('#form');
        let mobile = $('#mobile');
        let code = $('#code');
        let submit = $('#submit');

        form.validate({
            rules: {
                mobile: {
                    required: true,
                    minlength:11,
                    isMobile:true
                },
                code: {
                    required: true,
                    minlength:6,
                    maxlength:6
                }
                 
            },
            messages: {
                mobile: {
                    required: '请输入您的手机号码',
                    minlength:'请输入正确的手机号码',
                    isMobile:'请输入正确的手机号码'
                },
                code: {
                    required: '请输入6位数验证码',
                    minlength:'请输入6位数验证码',
                    maxlength:'请输入6位数验证码'
                }
            },
            errorPlacement: function(error,element) {
                element.parents('.am-form-group').next().html(error);
            }
        });
        
        //获取验证码
        {
            $('.get-smscode').find('a').click(function() {
                form.trigger('submit');
                let mobileValue = $.trim(mobile.val());
                if(mobile.hasClass('valid')) {
                    $.ajax({
                        type:'get',
                        url:`/login/getSmsCode/${mobileValue}`
                    }).done(data=> {

                        console.info(data);
                        
                    });
                }
            });
        }
        
    }
    
    
};