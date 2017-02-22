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
                    minlength: 11,
                    isMobile: true
                },
                code: {
                    required: true,
                    minlength: 6,
                    maxlength: 6
                }

            },
            messages: {
                mobile: {
                    required: '请输入您的手机号码',
                    minlength: '请输入正确的手机号码',
                    isMobile: '请输入正确的手机号码'
                },
                code: {
                    required: '请输入6位数验证码',
                    minlength: '请输入6位数验证码',
                    maxlength: '请输入6位数验证码'
                }
            },
            errorPlacement: function (error, element) {
                element.parents('.am-form-group').next().html(error);
            },
            submitHandler: function (form) {

                let $form = $(form);
                if ($form.data('state')) {
                    return false;
                }
                $form.data('state', true);
                submit.prop('disabled', true).text('登录中...');

                $.ajax({
                    type: 'post',
                    url: `/user/login/to-login/${$.trim(mobile.val())}/${$.trim(code.val())}`
                }).done(data => {
                    if (data.success) {
                        submit.text('登录成功!');
                        setTimeout(()=> {
                            location.href = '/';
                        }, 2000);
                    } else {
                        submit.prop('disabled', false).text('登录');
                        $form.data('state', false);
                        code.parents('.am-form-group').next().html('验证码有误或已过期,请重新输入!');
                    }
                });
            }
        });

        //获取验证码
        {
           this.getSmsCode(mobile);
        }

        mobile.on({
            keyup: function () {
                if (!$.trim(this.value)) {
                    submit.prop('disabled', true);
                } else {
                    submit.prop('disabled', false);
                }
            }
        });

    },
    
    userInfoFun() {

        let form = $('#form');
        let submit = $('#submit');
        let modal = $('#modal-confirm');
        
        form.validate({
            rules: {
                nickname: {
                    required: true
                },
                birthday: {
                    dateISO:true
                }
            },
            messages: {
                nickname: {
                    required: '请输入您的用户名/昵称'
                },
                birthday: {
                    dateISO:'请输入有效的日期 (1990/12/31)'
                }
            },
            errorPlacement:error => {
                $('.message').html(error);
            },
            submitHandler() {
                submit.prop('disabled',true);
                $.ajax({
                    type:'post',
                    url:'/user/userinfo/edit',
                    data:form.serialize()
                }).then(data => {
                    submit.prop('disabled',false);
                    if(data.success) {
                        modal.modal({
                            closeViaDimmer:0
                        });
                        setTimeout(()=> {
                            location.href = '/';
                        },3000);
                    }
                },error => {
                    submit.prop('disabled',false);
                    alert(error);
                });
                
            }
        });
        
    },

    mobileFun() {

        let form = $('#form');
        let mobile = $('#mobile');
        let code = $('#code');
        let submit = $('#submit');
        let modal = $('#modal-confirm');

        this.getSmsCode(mobile);

        //表单验证
        form.validate({
            rules: {
                mobile: {
                    required: true,
                    minlength: 11,
                    isMobile: true
                },
                code: {
                    required: true,
                    minlength: 6,
                    maxlength: 6
                }

            },
            messages: {
                mobile: {
                    required: '请输入您的手机号码',
                    minlength: '请输入正确的手机号码',
                    isMobile: '请输入正确的手机号码'
                },
                code: {
                    required: '请输入6位数验证码',
                    minlength: '请输入6位数验证码',
                    maxlength: '请输入6位数验证码'
                }
            },
            errorPlacement: function (error, element) {
                element.parents('.am-form-group').next().html(error);
            },
            submitHandler: function (form) {

                let $form = $(form);
                if ($form.data('state')) {
                    return false;
                }
                $form.data('state', true);
                submit.prop('disabled', true).text('更新中...');

                $.ajax({
                    type: 'post',
                    url:`/user/mobile/update/${$.trim(mobile.val())}/${$.trim(code.val())}`,
                }).done(data => {
                    if (data.success) {
                        modal.modal({
                            closeViaDimmer:0
                        });
                        setTimeout(()=> {
                            location.href = '/';
                        },3000);
                    } else {
                        submit.prop('disabled', false).text('更新/绑定手机号');
                        $form.data('state', false);
                        code.parents('.am-form-group').next().html('验证码有误或已过期,请重新输入!');
                    }
                });
            }
        });

        mobile.on({
            keyup: function () {
                if (!$.trim(this.value)) {
                    submit.prop('disabled', true);
                } else {
                    submit.prop('disabled', false);
                }
            }
        });
        
    },
    
    //获取手机验证号
    getSmsCode(mobile) {

        let getSmsCode = $('.get-smscode');
        let getLink = getSmsCode.find('a');
        let time = getSmsCode.find('em');
        let times = time.find('b');

        getLink.click(function () {

            let mobileValue = $.trim(mobile.val());

            if(!mobileValue) {
                mobile[0].focus();
                return false;
            }

            if(!/^1[0-9]{10}$/.test(mobileValue)) {
                $('.error-mobile').text('请输入正确的手机号码');
                mobile[0].focus();
                return false;
            }

            if (mobile.hasClass('valid')) {
                $.ajax({
                    type: 'get',
                    url: `/user/login/get-smscode/${mobileValue}`
                }).done(data => {
                    if (data.success) {
                        let count = 59;
                        times.text(count);
                        getSmsCode.addClass('on');
                        let interval = setInterval(()=> {
                            count--;
                            times.text(count);
                            if (count === 0) {
                                clearInterval(interval);
                                getSmsCode.removeClass('on');
                            }
                        }, 1000);

                    } else {
                        code.parents('.am-form-group').next().html('请求超时,请稍后再试!');
                    }
                });
            }
        });
        
    }

};