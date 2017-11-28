'use strict';

module.exports = {

    loginFun() {

        let form = $('#form');
        let mobile = $('#mobile');
        let code = $('#code');
        let submit = $('#submit');
        let referer = $('#referer');

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
                            location.href = referer.val();
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
        let id = $('#member-id');
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
                    url:`/user/mobile/update/${$.trim(mobile.val())}/${$.trim(code.val())}/${id.val()}`
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
                        getSmsCode.parents('.am-form-group').next().html('请求超时,请稍后再试!');
                    }
                });
            }
        });
        
    },

    wishFun:function() {

        $('.main-list').setInfinitescroll({
            setPathParse:(path,page)=> {
                let url = $('.navigation').find('a').attr('href');
                url = url.replace(/(page=\d+)/,'page=');
                return [url,''];
            },
            setData:data=> {
                let content = '';
                $.each(data.items,function(i,item) {

                    let price = item.price > 0 ? item.price +'.00' : '-';
                    let image = (()=> {
                        let img = '';
                        for(let n in item.mainImage) {
                            if (item.mainImage[n].isMainImage) {
                                img = item.mainImage[n].url;
                                break;
                            }
                        }
                        return img;
                    })();

                    let stock = item.stock > 0 ? '<span class="active"><i class="am-icon-check"></i>现货</span>' :'';
                    let isRefund = item.isRefund ? '<span class="active"><i class="am-icon-history"></i>7天退款</span>' : '';
                    let isHandmade = item.isHandmade ? '<span class="active"><i class="am-icon-modx"></i>纯手工</span>' : '';
                    let isOnly = item.isOnly ? '<span class="active"><i class="am-icon-gavel"></i>只此一件 </span>' : '';
                    let isStockText = item.stock > 0 ? '[现货]' : '';
                    let isShortStockText = item.isShortStock ? '[缺货]' : '';
                    let isShortStockCss = item.isShortStock ? 'class="out-stock"' : '';

                    content += `
                    <li>
                        <div class="img">
                            <a href="/product/detail/${item.productId}"><img src="//ac-JoaBcRTt.clouddn.com/3a994354f637e827ae7e.png" class="lazy" width="100" height="100" data-original="${image}?imageMogr2/thumbnail/200"></a>
                        </div>
                        <div class="detail">
                            <h3>
                                <a href="/product/detail/${item.productId}" ${isShortStockCss}>
                                  ${isStockText}${isShortStockText} ${item.name}
                                </a>
                            </h3>
                            <p>
                            <span class="price">¥ <strong>${price}</strong></span>
                            <span>${item.pageViews}次浏览</span>
                            <span>已售${item.sales}件</span>
                            </p>
                            <p>
                                ${isRefund} ${stock} ${isHandmade} ${isOnly}
                            </p>
                        </div>
                    </li>
                `;

                });
                return content;
            }
        });


        //取消收藏
        $('.main-list').on('click','.cancel-fav',function() {
            $.ajax({
                url:$(this).attr('href'),
                success:()=> {
                    $(this).parents('li').animate({
                        opacity:0,
                        height:0,
                        padding:0
                    });
                }
            });
            return false;
        });
        
    }

};