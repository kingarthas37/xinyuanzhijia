require=function n(e,i,a){function t(r,c){if(!i[r]){if(!e[r]){var s="function"==typeof require&&require;if(!c&&s)return s(r,!0);if(o)return o(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var d=i[r]={exports:{}};e[r][0].call(d.exports,function(n){var i=e[r][1][n];return t(i?i:n)},d,d.exports,n,e,i,a)}return i[r].exports}for(var o="function"==typeof require&&require,r=0;r<a.length;r++)t(a[r]);return t}({4:[function(n,e,i){"use strict";n("../../../../js/main"),n("./config"),n("./common"),n("./common-dom")},{"../../../../js/main":15,"./common":2,"./common-dom":1,"./config":3}],3:[function(n,e,i){"use strict";window.leanApp={AppID:"QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz",AppKey:"Wwh9RRHIySPlvToe3dsIVfS7",MasterKey:"mCIsLsrtOgujruzfcEGDm9Uh",api:"https://api.leancloud.cn/1.1/"}},{}],2:[function(n,e,i){"use strict";n("amazeui");Array.prototype.unique=function(){for(var n=[],e={},i=0;i<this.length;i++)e[this[i]]||(n.push(this[i]),e[this[i]]=1);return n},Array.prototype.remove=function(n){for(var e=0;e<this.length;e++){var i=this[e];if(isNaN(n)||(i=e),i==n){for(var a=e;a<this.length;a++)this[a]=this[a+1];this.length=this.length-1}}},$(function(){window.WIN_WIDTH=$(window).width(),window.WIN_HEIGHT=$(window).height(),window.leanAppHeader={"x-avoscloud-application-id":window.leanApp.AppID,"x-avoscloud-application-key":window.leanApp.AppKey,"content-type":"application/json"},window.isLogin=!!$.cookie("login");for(var n,e=function(){},i=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],a=i.length,t=window.console=window.console||{};a--;)n=i[a],t[n]||(t[n]=e);jQuery.validator.addMethod("isMobile",function(n,e){var i=n.length,a=/^1[0-9]{10}$/;return this.optional(e)||11==i&&a.test(n)},"请正确填写您的手机号码")})},{amazeui:6}],1:[function(n,e,i){"use strict";var a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},t=n("bloodhound");$(function(){$(".go-back").click(function(){history.go(-1)}),$("img.lazy").lazyload(),!function(){var n=$(".search-go-panel"),e=$("#search-box"),i=$(".search-close").find("a"),a=$("#search-input"),t=$(".search-select"),o=$("#search-product-method");t.dropdown(),n.click(function(){e.offCanvas("open")}),i.click(function(){e.offCanvas("close")}),e.on("open.offcanvas.amui",function(){a[0].focus()}),t.find(".am-dropdown-content a").click(function(){o.val($(this).data("product-method-id"))})}(),!function(){var n=$(".am-alert");n.length&&(n.fadeIn(),setTimeout(function(){return n.fadeOut()},2e3))}(),!function(){var n=$("#search-input"),e=$(".search-select"),i=e.find(".am-dropdown-content"),a=e.find(".am-btn");e.on("close.dropdown.amui",function(n){}),i.find("a").click(function(){i.find(".am-active").removeClass("am-active"),$(this).parent().addClass("am-active"),e.dropdown("close"),a.find("em").text($(this).text()),n.attr("placeholder","搜索"+$(this).text()),n[0].focus()})}(),!function(){var n=$("#search-box"),e=(n.find(".search"),n.find("#search-input"));$("#search-product-method");e.typeahead(null,{limit:10,display:function(n){return n.value},highlight:!0,templates:{suggestion:function(n){return'<div><a href="/product/detail/'+n.productId+'">'+n.value+"</a></div>"}},source:new t({datumTokenizer:t.tokenizers.obj.whitespace("value"),queryTokenizer:t.tokenizers.whitespace,remote:{url:"/suggest",prepare:function(n,i){return i.data={name:$.trim(e.val())},i}}})}),n.find(".tt-menu").css({width:WIN_WIDTH})}(),!function(){var n=$.cookie("search-result"),e=$("#search-input"),i=$(".search-history ul"),a=$(".search-form"),t=$("#search-product-method"),o=[];n?(o=n.split(","),$.each(o,function(n,e){e=decodeURIComponent(e),i.append('<li><a href="/search?method='+t.val()+"&keywords="+e+'">'+e+"</a></li>")})):i.append('<li><a class="color-gray" href="javascript:;">无搜索记录</a></li>'),a.submit(function(){var n=$.trim(e.val());o.unshift(n),o=o.unique(),o.length>5&&(o.length=5),$.cookie("search-result",o.join(),{expires:new Date((new Date).getTime()+2592e6),path:"/"})}),$(".clear-history").click(function(){return i.find("li").length?(i.find("li").detach(),void $.cookie("search-result","",{expires:new Date((new Date).getTime()),path:"/"})):!1})}(),!function(){var n=$(".main-list");n.infinitescroll({debug:!1,loading:{img:"//51wish.cn/min/images/admin/common/loading.gif",msgText:"加载中...",speed:500},animate:!1,itemSelector:"li",navSelector:".navigation",nextSelector:".navigation a",dataType:"json",appendCallback:!1,pathParse:function(n,e){return["/search/ajax?page=",location.search.replace("?","&")]}},function(e,i){if(!e.items.length){var t=function(){$("#infscr-loading").detach(),n.infinitescroll("unbind"),n.append('<div class="loading"></div>');var e=$('<div id="infscr-loading" style="display: none;">当前选择下已加载全部内容</div>');return n.find(".loading").append(e),e.fadeIn(),setTimeout(function(){e.fadeOut()},3e3),{v:!1}}();if("object"===("undefined"==typeof t?"undefined":a(t)))return t.v}var o="";$.each(e.items,function(n,e){var i=e.price>0?parseFloat(e.price):0,a=function(){var n="";for(var i in e.mainImage)if(e.mainImage[i].isMainImage){n=e.mainImage[i].url;break}return n}(),t=e.stock>0?'<span class="active"><i class="am-icon-check"></i>现货</span>':"",r=e.isRefund?'<span class="active"><i class="am-icon-history"></i>7天退款</span>':"",c=e.isHandmade?'<span class="active"><i class="am-icon-modx"></i>纯手工</span>':"",s=e.isOnly?'<span class="active"><i class="am-icon-gavel"></i>只此一件 </span>':"";o+='\n                    <li>\n                        <div class="img">\n                            <a href="/detail/'+e.productId+'"><img src="/min/images/default/common/lazy.png" class="lazy" width="100" height="100" data-original="'+a+'?imageMogr2/thumbnail/200"></a>\n                        </div>\n                        <div class="detail">\n                            <h3><a href="/detail/'+e.productId+'">'+e.name+'</a></h3>\n                            <p>\n                            <span class="price">¥ <strong>'+i+"</strong></span>\n                            <span>"+e.pageViews+"次浏览</span>\n                            </p>\n                            <p>\n                                "+t+" "+r+" "+c+" "+s+"\n                            </p>\n                        </div>\n                    </li>\n                "});var r=$(o);r.find("img.lazy").lazyload(),n.append(r)})}()})},{bloodhound:7}]},{},[4]);
require=function e(t,i,r){function n(a,s){if(!i[a]){if(!t[a]){var u="function"==typeof require&&require;if(!s&&u)return u(a,!0);if(o)return o(a,!0);var d=new Error("Cannot find module '"+a+"'");throw d.code="MODULE_NOT_FOUND",d}var c=i[a]={exports:{}};t[a][0].call(c.exports,function(e){var i=t[a][1][e];return n(i?i:e)},c,c.exports,e,t,i,r)}return i[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)n(r[a]);return n}({5:[function(e,t,i){"use strict";e("../../../../js/main"),e("./index"),e("./user"),e("./product")},{"../../../../js/main":15,"./index":"index","./product":"product","./user":"user"}],user:[function(e,t,i){"use strict";t.exports={loginFun:function(){var e=$("#form"),t=$("#mobile"),i=$("#code"),r=$("#submit"),n=$("#referer");e.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(e,t){t.parents(".am-form-group").next().html(e)},submitHandler:function(e){var o=$(e);return o.data("state")?!1:(o.data("state",!0),r.prop("disabled",!0).text("登录中..."),void $.ajax({type:"post",url:"/user/login/to-login/"+$.trim(t.val())+"/"+$.trim(i.val())}).done(function(e){e.success?(r.text("登录成功!"),setTimeout(function(){location.href=n.val()},2e3)):(r.prop("disabled",!1).text("登录"),o.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),this.getSmsCode(t),t.on({keyup:function(){$.trim(this.value)?r.prop("disabled",!1):r.prop("disabled",!0)}})},userInfoFun:function(){var e=$("#form"),t=$("#submit"),i=$("#modal-confirm");e.validate({rules:{nickname:{required:!0},birthday:{dateISO:!0}},messages:{nickname:{required:"请输入您的用户名/昵称"},birthday:{dateISO:"请输入有效的日期 (1990/12/31)"}},errorPlacement:function(e){$(".message").html(e)},submitHandler:function(){t.prop("disabled",!0),$.ajax({type:"post",url:"/user/userinfo/edit",data:e.serialize()}).then(function(e){t.prop("disabled",!1),e.success&&(i.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3))},function(e){t.prop("disabled",!1),alert(e)})}})},mobileFun:function(){var e=$("#form"),t=$("#mobile"),i=$("#code"),r=$("#submit"),n=$("#modal-confirm"),o=$("#member-id");this.getSmsCode(t),e.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(e,t){t.parents(".am-form-group").next().html(e)},submitHandler:function(e){var a=$(e);return a.data("state")?!1:(a.data("state",!0),r.prop("disabled",!0).text("更新中..."),void $.ajax({type:"post",url:"/user/mobile/update/"+$.trim(t.val())+"/"+$.trim(i.val())+"/"+o.val()}).done(function(e){e.success?(n.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3)):(r.prop("disabled",!1).text("更新/绑定手机号"),a.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),t.on({keyup:function(){$.trim(this.value)?r.prop("disabled",!1):r.prop("disabled",!0)}})},getSmsCode:function r(e){var r=$(".get-smscode"),t=r.find("a"),i=r.find("em"),n=i.find("b");t.click(function(){var t=$.trim(e.val());return t?/^1[0-9]{10}$/.test(t)?void(e.hasClass("valid")&&$.ajax({type:"get",url:"/user/login/get-smscode/"+t}).done(function(e){e.success?!function(){var e=59;n.text(e),r.addClass("on");var t=setInterval(function(){e--,n.text(e),0===e&&(clearInterval(t),r.removeClass("on"))},1e3)}():r.parents(".am-form-group").next().html("请求超时,请稍后再试!")})):($(".error-mobile").text("请输入正确的手机号码"),e[0].focus(),!1):(e[0].focus(),!1)})}}},{}],product:[function(e,t,i){"use strict";var r=e("photoswipe"),n=e("photoswipe-ui");t.exports={detailFun:function(){var e=this;this.favoriteProduct(),$(".am-slider").flexslider({directionNav:!1}),!function(){var t=e,i=$(".detail-image"),r=i.find("img").length,n=0;i.find("img").each(function(e,o){o.onload=function(){n++,$(o).attr({width:$(o).width(),height:$(o).height()}),n===r&&i.find("img").each(function(e,r){$(r).click(function(){t.createPhotoSwipe(i,e)})})}})}()},favoriteProduct:function(){var e=$("#favorite"),t=$(".favorite-text"),i=$(".favorite-count");e.click(function(){if(!window.isLogin)return location.href="/user/login?return="+location.pathname,!1;var e=$(this).data("product-id"),r=parseInt(i.text());this.checked?$.ajax({url:"/user/wish/add/"+e}).then(function(e){e.success&&(t.parent().addClass("active"),t.text("已收藏"),i.text(r+1))}):$.ajax({url:"/user/wish/edit/"+e}).then(function(e){e.success&&(t.parent().removeClass("active"),t.text("收藏"),i.text(r-1))})})},createPhotoSwipe:function(e,t){var i=[];e.find("img").each(function(e,t){i.push({src:$(t).attr("src"),w:$(t).attr("width"),h:$(t).attr("height")})});var o={index:t},a=new r($(".pswp")[0],n,i,o);a.init()}}},{photoswipe:17,"photoswipe-ui":16}],index:[function(e,t,i){"use strict";t.exports={indexFun:function(){}}},{}]},{},[5]);