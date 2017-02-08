'use strict';

module.exports = {

    loginFun() {
        
        let errofInfo = $('.error-info');
        let submit = $('#submit');
        let title = $('h1');
        
        $('#form').validate({
            rules: {
                mobile: {
                    required: true,
                    minlength:11,
                    isMobile:true
                }
                 
            },
            messages: {
                mobile: {
                    required: '请输入您的手机号码',
                    minlength:'请输入正确的手机号码',
                    isMobile:'请输入正确的手机号码'
                }
            },
            errorPlacement: function(error,element) {
                errofInfo.html(error);
            }
        });
        
        
        $('.link-sign').click(function() {
            if($(this).hasClass('register')) {
                $(this).removeClass('register').addClass('login');
                $(this).find('span').text('用户登录');
                submit.text('立即注册');
                title.text('新用户注册');
            } else {
                $(this).removeClass('login').addClass('register');
                $(this).find('span').text('新用户注册');
                submit.text('登录');
                title.text('用户登录');
            }
        });
        
    }
    
    
};