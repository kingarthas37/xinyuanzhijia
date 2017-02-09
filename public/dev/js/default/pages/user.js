'use strict';

module.exports = {

    loginFun() {
        
        let form = $('#form');
        let mobile = $('#mobile');
        let code = $('#code');
        let submit = $('#submit');

        //表单验证
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
            },
            submitHandler:function(form){
                
                let $form = $(form);
                if($form.data('state')) {
                    return false;
                }
                $form.data('state',true);
                submit.prop('disabled',true).text('登录中...');
                
                $.ajax({
                    type:'post',
                    url:`/login/to-login/${$.trim(mobile.val())}/${$.trim(code.val())}`
                }).done(data => {
                        if(data.success) {
                            submit.text('登录成功!');
                            setTimeout(()=> {
                                location.href = '/';
                            },1000);
                        } else {
                            submit.prop('disabled',false).text('登录');
                            $form.data('state',false);
                            code.parents('.am-form-group').next().html('验证码有误,请重新输入!');
                        }
                });
            }
        });
        
        //获取验证码
        {
            let getSmsCode = $('.get-smscode');
            let getLink = getSmsCode.find('a');
            let time = getSmsCode.find('em');
            let times = time.find('b');

            getLink.click(function() {
                form.trigger('submit');
                let mobileValue = $.trim(mobile.val());
                if(mobile.hasClass('valid')) {
                    $.ajax({
                        type:'get',
                        url:`/login/get-smscode/${mobileValue}`
                    }).done(data => {
                        if(data.success) {
                            let count = 60;
                            times.text(count);
                            getSmsCode.addClass('on');
                            let interval = setInterval(()=> {
                                count --;
                                times.text(count);
                                if(count === 0) {
                                    clearInterval(interval);
                                    getSmsCode.removeClass('on');
                                }
                            },1000);
                            
                        } else {
                            alert(data.error);
                        }
                    });
                }
            });
        }
        
        mobile.on({
            keyup:function() {
                if(!$.trim(this.value)) {
                    submit.removeClass('am-btn-primary').addClass('am-btn-default');
                } else {
                    submit.removeClass('am-btn-default').addClass('am-btn-primary');
                }
            }
        });
        
    }
    
    
};