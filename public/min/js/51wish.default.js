require=function n(e,t,i){function a(r,s){if(!t[r]){if(!e[r]){var c="function"==typeof require&&require;if(!s&&c)return c(r,!0);if(o)return o(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var u=t[r]={exports:{}};e[r][0].call(u.exports,function(n){var t=e[r][1][n];return a(t?t:n)},u,u.exports,n,e,t,i)}return t[r].exports}for(var o="function"==typeof require&&require,r=0;r<i.length;r++)a(i[r]);return a}({5:[function(n,e,t){"use strict";n("../../../../js/main"),n("./config"),n("./common"),n("./common-dom"),n("./utils"),n("./log")},{"../../../../js/main":17,"./common":2,"./common-dom":1,"./config":3,"./log":4,"./utils":6}],3:[function(n,e,t){"use strict";window.leanApp={AppID:"QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz",AppKey:"Wwh9RRHIySPlvToe3dsIVfS7",MasterKey:"mCIsLsrtOgujruzfcEGDm9Uh",api:"https://api.leancloud.cn/1.1/"}},{}],2:[function(n,e,t){"use strict";n("amazeui");Array.prototype.unique=function(){for(var n=[],e={},t=0;t<this.length;t++)e[this[t]]||(n.push(this[t]),e[this[t]]=1);return n},Array.prototype.remove=function(n){for(var e=0;e<this.length;e++){var t=this[e];if(isNaN(n)||(t=e),t==n){for(var i=e;i<this.length;i++)this[i]=this[i+1];this.length=this.length-1}}},$(function(){window.WIN_WIDTH=$(window).width(),window.WIN_HEIGHT=$(window).height(),window.leanAppHeader={"x-avoscloud-application-id":window.leanApp.AppID,"x-avoscloud-application-key":window.leanApp.AppKey,"content-type":"application/json"},window.isLogin=!!$.cookie("login"),window.globalVar={gLog:n("./log")};for(var e,t=function(){},i=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],a=i.length,o=window.console=window.console||{};a--;)e=i[a],o[e]||(o[e]=t);jQuery.validator.addMethod("isMobile",function(n,e){var t=n.length,i=/^1[0-9]{10}$/;return this.optional(e)||11==t&&i.test(n)},"请正确填写您的手机号码")})},{"./log":4,amazeui:8}],4:[function(n,e,t){"use strict";e.exports={_l:function(n){if(n){for(var e=n[0],t=1;t<n.length;t++)e=e.indexOf("%s")>-1?e.replace("%s",n[t]):e.replace("{}",n[t]);console.log(e)}},_serializeArguments:function(n){if(n){for(var e=n[0],t=1;t<n.length;t++)e=e.indexOf("%s")>-1?e.replace("%s",n[t]):e.replace("{}",n[t]);return e}},serializeArguments:function(n){return this._serializeArguments(Array.prototype.slice.apply(arguments))},log:function(n){this._l(Array.prototype.slice.apply(arguments))},info:function(n){this._l(Array.prototype.slice.apply(arguments))},debug:function(n){this._l(Array.prototype.slice.apply(arguments))},warn:function(n){var e=Array.prototype.slice.apply(arguments);e&&(e[0]="[warn]"+e[0]),this._l(e)},error:function(n){var e=Array.prototype.slice.apply(arguments);e&&(e[0]="[error]"+e[0]),this._l(e)},writeObjToJson:function(n){return JSON.stringify(n)}}},{}],1:[function(n,e,t){"use strict";var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},a=n("bloodhound");$(function(){$(".go-back").click(function(){history.go(-1)}),$("img.lazy").lazyload(),!function(){var n=$(".search-go-panel"),e=$("#search-box"),t=$(".search-close").find("a"),i=$("#search-input"),a=$(".search-select");a.dropdown(),n.click(function(){e.offCanvas("open")}),t.click(function(){e.offCanvas("close")}),e.on("open.offcanvas.amui",function(){i[0].focus()})}(),!function(){var n=$(".am-alert");n.length&&(n.fadeIn(),setTimeout(function(){return n.fadeOut()},2e3))}(),!function(){var n=$("#search-input"),e=$(".search-select"),t=e.find(".am-dropdown-content"),i=e.find(".am-btn");t.find("a").click(function(){t.find(".am-active").removeClass("am-active"),$(this).parent().addClass("am-active"),e.dropdown("close"),i.find("em").text($(this).text()),n.attr("placeholder","搜索"+$(this).text()),n[0].focus()})}(),!function(){var n=$("#search-box"),e=(n.find(".search"),n.find("#search-input")),t=function(){return/method=\d+/.test(location.search)?/method=(\d+)/.exec(location.search)[1]:3}();$("#search-product-method").val(t),e.typeahead(null,{limit:10,display:function(n){return n.value},highlight:!0,templates:{suggestion:function(n){return'<div><a href="/product/detail/'+n.productId+'">'+n.value+"</a></div>"}},source:new a({datumTokenizer:a.tokenizers.obj.whitespace("value"),queryTokenizer:a.tokenizers.whitespace,remote:{url:"/suggest",prepare:function(n,i){return i.data={name:$.trim(e.val()),productMethodId:t},i}}})}),n.find(".tt-menu").css({width:WIN_WIDTH})}(),!function(){var n=$.cookie("search-result"),e=$("#search-input"),t=$(".search-history ul"),i=$(".search-form"),a=$("#search-product-method"),o=[];n?(o=n.split(","),$.each(o,function(n,e){e=decodeURIComponent(e),t.append('<li><a href="/search?method='+a.val()+"&keywords="+e+'">'+e+"</a></li>")})):t.append('<li><a class="color-gray" href="javascript:;">无搜索记录</a></li>'),i.submit(function(){var n=$.trim(e.val());o.unshift(n),o=o.unique(),o.length>5&&(o.length=5),$.cookie("search-result",o.join(),{expires:new Date((new Date).getTime()+2592e6),path:"/"})}),$(".clear-history").click(function(){return t.find("li").length?(t.find("li").detach(),void $.cookie("search-result","",{expires:new Date((new Date).getTime()),path:"/"})):!1})}(),!function(){var n=$(".main-list");n.infinitescroll({debug:!1,loading:{img:"//ac-JoaBcRTt.clouddn.com/8ded071cdd14788c50fa.gif",msgText:"加载中...",speed:500},animate:!1,itemSelector:"li",navSelector:".navigation",nextSelector:".navigation a",dataType:"json",appendCallback:!1,pathParse:function(n,e){var t=$(".navigation").find("a").attr("href");return t=t.replace(/(page=\d+)/,"page="),[t,$("#ajax-search").val()]}},function(e,t){if(!e.items.length){var a=function(){$("#infscr-loading").detach(),n.infinitescroll("unbind"),n.append('<div class="loading"></div>');var e=$('<div id="infscr-loading" style="display: none;">当前选择下已加载全部内容</div>');return n.find(".loading").append(e),e.fadeIn(),setTimeout(function(){e.fadeOut()},3e3),{v:!1}}();if("object"===("undefined"==typeof a?"undefined":i(a)))return a.v}var o="";$.each(e.items,function(n,e){var t=e.price>0?e.price+".00":"-",i=function(){var n="";for(var t in e.mainImage)if(e.mainImage[t].isMainImage){n=e.mainImage[t].url;break}return n}(),a=e.stock>0?'<span class="active"><i class="am-icon-check"></i>现货</span>':"",r=e.isRefund?'<span class="active"><i class="am-icon-history"></i>7天退款</span>':"",s=e.isHandmade?'<span class="active"><i class="am-icon-modx"></i>纯手工</span>':"",c=e.isOnly?'<span class="active"><i class="am-icon-gavel"></i>只此一件 </span>':"",l=e.stock>0?"[现货]":"",u=e.isShortStock?"[缺货]":"",p=e.isShortStock?'class="out-stock"':"";o+='\n                    <li>\n                        <div class="img">\n                            <a href="/product/detail/'+e.productId+'"><img src="//ac-JoaBcRTt.clouddn.com/3a994354f637e827ae7e.png" class="lazy" width="100" height="100" data-original="'+i+'?imageMogr2/thumbnail/200"></a>\n                        </div>\n                        <div class="detail">\n                            <h3>\n                                <a href="/product/detail/'+e.productId+'" '+p+">\n                                  "+l+u+" "+e.name+'\n                                </a>\n                            </h3>\n                            <p>\n                            <span class="price">¥ <strong>'+t+"</strong></span>\n                            <span>"+e.pageViews+"次浏览</span>\n                            <span>已售"+e.sales+"件</span>\n                            </p>\n                            <p>\n                                "+r+" "+a+" "+s+" "+c+"\n                            </p>\n                        </div>\n                    </li>\n                "});var r=$(o);r.find("img.lazy").lazyload(),n.append(r)})}()})},{bloodhound:9}]},{},[5]);
require=function e(t,i,n){function r(a,s){if(!i[a]){if(!t[a]){var l="function"==typeof require&&require;if(!s&&l)return l(a,!0);if(o)return o(a,!0);var d=new Error("Cannot find module '"+a+"'");throw d.code="MODULE_NOT_FOUND",d}var c=i[a]={exports:{}};t[a][0].call(c.exports,function(e){var i=t[a][1][e];return r(i?i:e)},c,c.exports,e,t,i,n)}return i[a].exports}for(var o="function"==typeof require&&require,a=0;a<n.length;a++)r(n[a]);return r}({7:[function(e,t,i){"use strict";e("../../../../js/main"),e("./order"),e("./index"),e("./user"),e("./product-detail")},{"../../../../js/main":17,"./index":"index","./order":"order","./product-detail":"product-detail","./user":"user"}],user:[function(e,t,i){"use strict";t.exports={loginFun:function(){var e=$("#form"),t=$("#mobile"),i=$("#code"),n=$("#submit"),r=$("#referer");e.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(e,t){t.parents(".am-form-group").next().html(e)},submitHandler:function(e){var o=$(e);return o.data("state")?!1:(o.data("state",!0),n.prop("disabled",!0).text("登录中..."),void $.ajax({type:"post",url:"/user/login/to-login/"+$.trim(t.val())+"/"+$.trim(i.val())}).done(function(e){e.success?(n.text("登录成功!"),setTimeout(function(){location.href=r.val()},2e3)):(n.prop("disabled",!1).text("登录"),o.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),this.getSmsCode(t),t.on({keyup:function(){$.trim(this.value)?n.prop("disabled",!1):n.prop("disabled",!0)}})},userInfoFun:function(){var e=$("#form"),t=$("#submit"),i=$("#modal-confirm");e.validate({rules:{nickname:{required:!0},birthday:{dateISO:!0}},messages:{nickname:{required:"请输入您的用户名/昵称"},birthday:{dateISO:"请输入有效的日期 (1990/12/31)"}},errorPlacement:function(e){$(".message").html(e)},submitHandler:function(){t.prop("disabled",!0),$.ajax({type:"post",url:"/user/userinfo/edit",data:e.serialize()}).then(function(e){t.prop("disabled",!1),e.success&&(i.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3))},function(e){t.prop("disabled",!1),alert(e)})}})},mobileFun:function(){var e=$("#form"),t=$("#mobile"),i=$("#code"),n=$("#submit"),r=$("#modal-confirm"),o=$("#member-id");this.getSmsCode(t),e.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(e,t){t.parents(".am-form-group").next().html(e)},submitHandler:function(e){var a=$(e);return a.data("state")?!1:(a.data("state",!0),n.prop("disabled",!0).text("更新中..."),void $.ajax({type:"post",url:"/user/mobile/update/"+$.trim(t.val())+"/"+$.trim(i.val())+"/"+o.val()}).done(function(e){e.success?(r.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3)):(n.prop("disabled",!1).text("更新/绑定手机号"),a.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),t.on({keyup:function(){$.trim(this.value)?n.prop("disabled",!1):n.prop("disabled",!0)}})},getSmsCode:function n(e){var n=$(".get-smscode"),t=n.find("a"),i=n.find("em"),r=i.find("b");t.click(function(){var t=$.trim(e.val());return t?/^1[0-9]{10}$/.test(t)?void(e.hasClass("valid")&&$.ajax({type:"get",url:"/user/login/get-smscode/"+t}).done(function(e){e.success?!function(){var e=59;r.text(e),n.addClass("on");var t=setInterval(function(){e--,r.text(e),0===e&&(clearInterval(t),n.removeClass("on"))},1e3)}():n.parents(".am-form-group").next().html("请求超时,请稍后再试!")})):($(".error-mobile").text("请输入正确的手机号码"),e[0].focus(),!1):(e[0].focus(),!1)})}}},{}],"product-detail":[function(e,t,i){"use strict";var n=e("photoswipe"),r=e("photoswipe-ui"),o=e("../common/utils");t.exports={init:function(){var e=this;this.productId=$("#product-id").val(),this.favoriteProduct(),this.eventsGood(),this.eventsShare(),$(".am-slider").flexslider({directionNav:!1,slideshow:!1}),$("img.lazy-container").lazyload({container:$(".lazy-container-view")}),!function(){var t=e,i=$(".detail-image"),n=i.find("img").length,r=0;i.find("img").each(function(e,o){o.onload=function(){r++;var e=$(o).width()/WIN_WIDTH;$(o).attr({"swipe-width":WIN_WIDTH,"swipe-height":$(o).height()/e}),r===n&&i.find("img").each(function(e,n){$(n).click(function(){t.createPhotoSwipe(i,e)})})}})}(),$("#tab-product-param").find("em").each(function(){if("date"==$(this).text()){var e=(new Date).getMonth()+1<=2?1:0;$(this).text((new Date).getFullYear()-e+"年")}}),!function(){var e=$(".attachment-content");e.length&&e.find(".show").click(function(){e.hasClass("on")?(e.removeClass("on"),e.find(".am-icon-angle-up").removeClass("am-icon-angle-up").addClass("am-icon-angle-down")):(e.addClass("on"),e.find(".am-icon-angle-down").removeClass("am-icon-angle-down").addClass("am-icon-angle-up"))})}()},favoriteProduct:function(){var e=$("#favorite"),t=$(".favorite-text"),i=$(".favorite-count");e.click(function(){if(!window.isLogin)return location.href="/user/login?return="+location.pathname,!1;var e=$(this).data("product-id"),n=parseInt(i.text());this.checked?$.ajax({url:"/user/wish/add/"+e}).then(function(e){e.success&&(t.parent().addClass("active"),t.text("已收藏"),i.text(n+1))}):$.ajax({url:"/user/wish/edit/"+e}).then(function(e){e.success&&(t.parent().removeClass("active"),t.text("收藏"),i.text(n-1))})})},createPhotoSwipe:function(e,t){var i=[];e.find("img").each(function(e,t){i.push({src:$(t).attr("data-original"),w:$(t).attr("swipe-width"),h:$(t).attr("swipe-height")})});var o={index:t},a=new n($(".pswp")[0],r,i,o);a.init()},eventsGood:function(){var e=this,t=$(".events-good");t.click(function(){if($(this).hasClass("active"))return!1;$(this).addClass("active");var t=$(this).find("em"),i=t.text()||0;0===i?t.text("( 1 )"):t.text(parseInt(i)+1),$.ajax({url:"/product/statistics/approval/"+e.productId})})},eventsShare:function(){var e=this,t=$(".events-share");t.click(function(){$(this).addClass("active"),$("body").append('<div class="share-bg"></div>'),$(".share-bg").click(function(){$(this).detach()}),$.ajax({url:"/product/statistics/share/"+e.productId})})},recommendProducts:function(e,t){for(var i=this,n=[],r=0;r<e.length;r++)for(var a=0;a<e[r].products.length;a++)n.push(e[r].products[a]);n.length>0&&$.ajax({type:"get",url:"/product/recommend/custom/"+n.join()}).then(function(n){for(var r=0;r<e.length;r++)for(var a=0;a<t.length;a++)e[r].productGroupId===t[a].productGroupId&&(e[r].name=t[a].productGroupName);for(var s=0;s<e.length;s++){e[s].html=[];for(var l=0;l<e[s].products.length;l++)for(var d=0;d<n.items.length;d++)n.items[d].productId===parseInt(e[s].products[l])&&e[s].html.push({productId:n.items[d].productId,name:n.items[d].name,image:o.productMainImageOutput(n.items[d].mainImage),price:n.items[d].price,isHot:n.items[d].isHot})}e=e.filter(function(e){return e.html.length}),i.recommendHtml(e)})},recommendHtml:function(e){var t=$(".recommend-content"),i="";$.each(e,function(e,t){i+='<div class="recommend"><h3>'+t.name+':</h3></div><div class="am-slider am-slider-default slider-recommend"><ul class="am-slides">',$.each(t.html,function(e,t){e%3===0&&(i+="<li>");var n=t.isHot?'<span class="hot"></span>':"",r=t.price?"<em>¥"+t.price+"</em>":"";i+='\n                    <dl>\n                        <dt>\n                            <a href="/product/detail/'+t.productId+'"><img src="'+t.image+'?imageMogr2/thumbnail/250" alt="'+t.name+'"></a>\n                            '+r+"\n                        </dt>\n                        <dd>"+n+t.name+"</dd>\n                    </dl>\n                "}),i+="</ul></div>"}),t.html(i),t.find(".am-slider").flexslider({directionNav:!1,slideshow:!1})}}},{"../common/utils":6,photoswipe:19,"photoswipe-ui":18}],order:[function(e,t,i){"use strict";t.exports={expressFun:function(){var e=$("#modal-search"),t=$("#modal-result");$(".search-tracking").click(function(){var i=$(this).data("tracking"),n=$(this).data("express");e.modal(),$.ajax({type:"get",url:"/order/express/query/"+i+"/"+n}).then(function(i){var n="";if(i.list)for(var r=0;r<i.list.length;r++){var o=r===i.list.length-1?"color-timeline-item-last":"",a=0===r?"green":"blue";n+='\n                            <li class="color-timeline-item '+o+'">\n                                <div class="color-timeline-item-tail"></div>\n                                <div class="color-timeline-item-head color-timeline-item-head-'+a+'"></div>\n                                <div class="color-timeline-item-content"><strong>'+i.list[r].time+"</strong> "+i.list[r].status+"</div>\n                            </li>\n                        "}else n='\n                        <li class="color-timeline-item color-timeline-item-last">\n                            <div class="color-timeline-item-tail"></div>\n                            <div class="color-timeline-item-head color-timeline-item-head-red"></div>\n                            <div class="color-timeline-item-content">'+i.msg+"</div>\n                        </li>\n                    ";e.modal("close"),t.find("ul").html(n),t.modal()},function(i){e.modal("close"),t.find("ul").html(i),t.modal()})})}}},{}],index:[function(e,t,i){"use strict";t.exports={indexFun:function(){}}},{}]},{},[7]);