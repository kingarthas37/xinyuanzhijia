require=function e(t,n,o){function i(a,s){if(!n[a]){if(!t[a]){var c="function"==typeof require&&require;if(!s&&c)return c(a,!0);if(r)return r(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var u=n[a]={exports:{}};t[a][0].call(u.exports,function(e){var n=t[a][1][e];return i(n?n:e)},u,u.exports,e,t,n,o)}return n[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({5:[function(e,t,n){"use strict";e("../../../../js/main"),e("./config"),e("./common"),e("./common-dom"),e("./utils"),e("./log")},{"../../../../js/main":17,"./common":2,"./common-dom":1,"./config":3,"./log":4,"./utils":6}],3:[function(e,t,n){"use strict";window.leanApp={AppID:"QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz",AppKey:"Wwh9RRHIySPlvToe3dsIVfS7",MasterKey:"mCIsLsrtOgujruzfcEGDm9Uh",api:"https://api.leancloud.cn/1.1/"},window.taobaoShop={shop1Name:"暮雪的心愿城",shop2Name:"亚特兰蒂斯之谜",shop1:"//muxue698.taobao.com",shop2:"//muxue928.taobao.com"}},{}],2:[function(e,t,n){"use strict";e("amazeui");Array.prototype.unique=function(){for(var e=[],t={},n=0;n<this.length;n++)t[this[n]]||(e.push(this[n]),t[this[n]]=1);return e},Array.prototype.remove=function(e){for(var t=0;t<this.length;t++){var n=this[t];if(isNaN(e)||(n=t),n==e){for(var o=t;o<this.length;o++)this[o]=this[o+1];this.length=this.length-1}}},$(function(){window.WIN_WIDTH=$(window).width(),window.WIN_HEIGHT=$(window).height(),window.leanAppHeader={"x-avoscloud-application-id":window.leanApp.AppID,"x-avoscloud-application-key":window.leanApp.AppKey,"content-type":"application/json"},window.isLogin=!!$.cookie("login"),window.globalVar={gLog:e("./log")};for(var t,n=function(){},o=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],i=o.length,r=window.console=window.console||{};i--;)t=o[i],r[t]||(r[t]=n);jQuery.validator.addMethod("isMobile",function(e,t){var n=e.length,o=/^1[0-9]{10}$/;return this.optional(t)||11==n&&o.test(e)},"请正确填写您的手机号码")})},{"./log":4,amazeui:8}],4:[function(e,t,n){"use strict";t.exports={_l:function(e){if(e){for(var t=e[0],n=1;n<e.length;n++)t=t.indexOf("%s")>-1?t.replace("%s",e[n]):t.replace("{}",e[n]);console.log(t)}},_serializeArguments:function(e){if(e){for(var t=e[0],n=1;n<e.length;n++)t=t.indexOf("%s")>-1?t.replace("%s",e[n]):t.replace("{}",e[n]);return t}},serializeArguments:function(e){return this._serializeArguments(Array.prototype.slice.apply(arguments))},log:function(e){this._l(Array.prototype.slice.apply(arguments))},info:function(e){this._l(Array.prototype.slice.apply(arguments))},debug:function(e){this._l(Array.prototype.slice.apply(arguments))},warn:function(e){var t=Array.prototype.slice.apply(arguments);t&&(t[0]="[warn]"+t[0]),this._l(t)},error:function(e){var t=Array.prototype.slice.apply(arguments);t&&(t[0]="[error]"+t[0]),this._l(t)},writeObjToJson:function(e){return JSON.stringify(e)}}},{}],1:[function(e,t,n){"use strict";var o=e("bloodhound");$(function(){$(".go-back").click(function(){history.go(-1)}),$("img.lazy").lazyload();var e=$(".search-go-panel"),t=$("#search-box"),n=$(".search-close").find("a"),i=$("#search-input"),r=$(".search-select");r.dropdown(),e.click(function(){t.offCanvas("open")}),n.click(function(){t.offCanvas("close")}),t.on("open.offcanvas.amui",function(){i[0].focus()});var a=$(".am-alert");a.length&&(a.fadeIn(),setTimeout(function(){return a.fadeOut()},2e3));var s=$("#search-input"),c=$(".search-select"),l=c.find(".am-dropdown-content"),u=c.find(".am-btn");l.find("a").click(function(){l.find(".am-active").removeClass("am-active"),$(this).parent().addClass("am-active"),c.dropdown("close"),u.find("em").text($(this).text()),s.attr("placeholder","搜索"+$(this).text()),s[0].focus()});var d=$("#search-box"),p=(d.find(".search"),d.find("#search-input")),f=function(){return/method=\d+/.test(location.search)?/method=(\d+)/.exec(location.search)[1]:3}();$("#search-product-method").val(f),p.typeahead(null,{limit:10,display:function(e){return e.value},highlight:!0,templates:{suggestion:function(e){return'<div><a href="/product/detail/'+e.productId+'">'+e.value+"</a></div>"}},source:new o({datumTokenizer:o.tokenizers.obj.whitespace("value"),queryTokenizer:o.tokenizers.whitespace,remote:{url:"/suggest",prepare:function(e,t){return t.data={name:$.trim(p.val()),productMethodId:f},t}}})}),d.find(".tt-menu").css({width:WIN_WIDTH});var h=$.cookie("search-result"),m=$("#search-input"),g=$(".search-history ul"),v=$(".search-form"),y=$("#search-product-method"),w=[];h?(w=h.split(","),$.each(w,function(e,t){t=decodeURIComponent(t),g.append('<li><a href="/search?method='+y.val()+"&keywords="+t+'">'+t+"</a></li>")})):g.append('<li><a class="color-gray" href="javascript:;">无搜索记录</a></li>'),v.submit(function(){var e=$.trim(m.val());w.unshift(e),w=w.unique(),w.length>5&&(w.length=5),$.cookie("search-result",w.join(),{expires:new Date((new Date).getTime()+2592e6),path:"/"})}),$(".clear-history").click(function(){return g.find("li").length?(g.find("li").detach(),void $.cookie("search-result","",{expires:new Date((new Date).getTime()),path:"/"})):!1}),$.fn.setInfinitescroll=function(e){var t=$(this),n=$.extend({navSelector:".navigation",nextSelector:".navigation a",setPathParse:function(){},setData:function(){}},e||{});return t.infinitescroll({debug:!1,loading:{img:"//ac-JoaBcRTt.clouddn.com/8ded071cdd14788c50fa.gif",msgText:"加载中...",speed:500},animate:!1,itemSelector:"li",navSelector:n.navSelector,nextSelector:n.nextSelector,dataType:"json",appendCallback:!1,pathParse:function(e,t){return n.setPathParse(e,t)}},function(e,o){if(!e.items.length){$("#infscr-loading").detach(),t.infinitescroll("unbind"),t.append('<div class="loading"></div>');var i=$('<div id="infscr-loading" style="display:none;">当前选择下已加载全部内容</div>');return t.find(".loading").append(i),i.fadeIn(),setTimeout(function(){i.fadeOut()},3e3),!1}var r=$(n.setData(e));r.find("img.lazy").lazyload(),t.append(r)}),t}})},{bloodhound:9}]},{},[5]);
require=function t(e,i,a){function n(s,r){if(!i[s]){if(!e[s]){var c="function"==typeof require&&require;if(!r&&c)return c(s,!0);if(o)return o(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var d=i[s]={exports:{}};e[s][0].call(d.exports,function(t){var i=e[s][1][t];return n(i?i:t)},d,d.exports,t,e,i,a)}return i[s].exports}for(var o="function"==typeof require&&require,s=0;s<a.length;s++)n(a[s]);return n}({7:[function(t,e,i){"use strict";t("../../../../js/main"),t("./home"),t("./order"),t("./index"),t("./user"),t("./product-list"),t("./product-detail"),t("./cart"),t("./article")},{"../../../../js/main":17,"./article":"article","./cart":"cart","./home":"home","./index":"index","./order":"order","./product-detail":"product-detail","./product-list":"product-list","./user":"user"}],user:[function(t,e,i){"use strict";e.exports={loginFun:function(){var t=$("#form"),e=$("#mobile"),i=$("#code"),a=$("#submit"),n=$("#referer");t.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(t,e){e.parents(".am-form-group").next().html(t)},submitHandler:function(t){var o=$(t);return o.data("state")?!1:(o.data("state",!0),a.prop("disabled",!0).text("登录中..."),void $.ajax({type:"post",url:"/user/login/to-login/"+$.trim(e.val())+"/"+$.trim(i.val())}).done(function(t){t.success?(a.text("登录成功!"),setTimeout(function(){location.href=n.val()},2e3)):(a.prop("disabled",!1).text("登录"),o.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),this.getSmsCode(e),e.on({keyup:function(){$.trim(this.value)?a.prop("disabled",!1):a.prop("disabled",!0)}})},userInfoFun:function(){var t=$("#form"),e=$("#submit"),i=$("#modal-confirm");t.validate({rules:{nickname:{required:!0},birthday:{dateISO:!0}},messages:{nickname:{required:"请输入您的用户名/昵称"},birthday:{dateISO:"请输入有效的日期 (1990/12/31)"}},errorPlacement:function(t){$(".message").html(t)},submitHandler:function(){e.prop("disabled",!0),$.ajax({type:"post",url:"/user/userinfo/edit",data:t.serialize()}).then(function(t){e.prop("disabled",!1),t.success&&(i.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3))},function(t){e.prop("disabled",!1),alert(t)})}})},mobileFun:function(){var t=$("#form"),e=$("#mobile"),i=$("#code"),a=$("#submit"),n=$("#modal-confirm"),o=$("#member-id");this.getSmsCode(e),t.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(t,e){e.parents(".am-form-group").next().html(t)},submitHandler:function(t){var s=$(t);return s.data("state")?!1:(s.data("state",!0),a.prop("disabled",!0).text("更新中..."),void $.ajax({type:"post",url:"/user/mobile/update/"+$.trim(e.val())+"/"+$.trim(i.val())+"/"+o.val()}).done(function(t){t.success?(n.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3)):(a.prop("disabled",!1).text("更新/绑定手机号"),s.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),e.on({keyup:function(){$.trim(this.value)?a.prop("disabled",!1):a.prop("disabled",!0)}})},getSmsCode:function a(t){var a=$(".get-smscode"),e=a.find("a"),i=a.find("em"),n=i.find("b");e.click(function(){var e=$.trim(t.val());return e?/^1[0-9]{10}$/.test(e)?void(t.hasClass("valid")&&$.ajax({type:"get",url:"/user/login/get-smscode/"+e}).done(function(t){if(t.success){var e=59;n.text(e),a.addClass("on");var i=setInterval(function(){e--,n.text(e),0===e&&(clearInterval(i),a.removeClass("on"))},1e3)}else a.parents(".am-form-group").next().html("请求超时,请稍后再试!")})):($(".error-mobile").text("请输入正确的手机号码"),t[0].focus(),!1):(t[0].focus(),!1)})},wishFun:function(){$(".main-list").setInfinitescroll({setPathParse:function(t,e){var i=$(".navigation").find("a").attr("href");return i=i.replace(/(page=\d+)/,"page="),[i,""]},setData:function(t){var e="";return $.each(t.items,function(t,i){var a=i.price>0?i.price+".00":"-",n=function(){var t="";for(var e in i.mainImage)if(i.mainImage[e].isMainImage){t=i.mainImage[e].url;break}return t}(),o=i.stock>0?'<span class="active"><i class="am-icon-check"></i>现货</span>':"",s=i.isRefund?'<span class="active"><i class="am-icon-history"></i>7天退款</span>':"",r=i.isHandmade?'<span class="active"><i class="am-icon-modx"></i>纯手工</span>':"",c=i.isOnly?'<span class="active"><i class="am-icon-gavel"></i>只此一件 </span>':"",l=i.stock>0?"[现货]":"",d=i.isShortStock?"[缺货]":"",u=i.isShortStock?'class="out-stock"':"";e+='\n                    <li>\n                        <div class="img">\n                            <a href="/product/detail/'+i.productId+'"><img src="//ac-JoaBcRTt.clouddn.com/3a994354f637e827ae7e.png" class="lazy" width="100" height="100" data-original="'+n+'?imageMogr2/thumbnail/200"></a>\n                        </div>\n                        <div class="detail">\n                            <h3>\n                                <a href="/product/detail/'+i.productId+'" '+u+">\n                                  "+l+d+" "+i.name+'\n                                </a>\n                            </h3>\n                            <p>\n                            <span class="price">¥ <strong>'+a+"</strong></span>\n                            <span>"+i.pageViews+"次浏览</span>\n                            <span>已售"+i.sales+"件</span>\n                            </p>\n                            <p>\n                                "+s+" "+o+" "+r+" "+c+"\n                            </p>\n                        </div>\n                    </li>\n                "}),e}}),$(".main-list").on("click",".cancel-fav",function(){var t=this;return $.ajax({url:$(this).attr("href"),success:function(){$(t).parents("li").animate({opacity:0,height:0,padding:0})}}),!1})},footmarkFun:function(){}}},{}],"product-list":[function(t,e,i){"use strict";t("../common/utils");e.exports={init:function(){var t=$(".main-list");t.setInfinitescroll({setPathParse:function(t,e){var i=$(".navigation").find("a").attr("href");return i=i.replace(/(page=\d+)/,"page="),[i,$("#ajax-search").val()]},setData:function(t){var e="";return $.each(t.items,function(t,i){var a=i.price>0?i.price+".00":"-",n=function(){var t="";for(var e in i.mainImage)if(i.mainImage[e].isMainImage){t=i.mainImage[e].url;break}return t}(),o=i.stock>0?'<span class="active"><i class="am-icon-check"></i>现货</span>':"",s=i.isRefund?'<span class="active"><i class="am-icon-history"></i>7天退款</span>':"",r=i.isHandmade?'<span class="active"><i class="am-icon-modx"></i>纯手工</span>':"",c=i.isOnly?'<span class="active"><i class="am-icon-gavel"></i>只此一件 </span>':"",l=i.stock>0?"[现货]":"",d=i.isShortStock?"[缺货]":"",u=i.isShortStock?'class="out-stock"':"",m=i.isWish?"add":"",h=i.isWish?"已收藏":"收藏";e+='\n                    <li data-product-id="'+i.productId+'">\n                        <div class="img">\n                            <a href="/product/detail/'+i.productId+'"><img src="//ac-JoaBcRTt.clouddn.com/3a994354f637e827ae7e.png" class="lazy" width="100" height="100" data-original="'+n+'?imageMogr2/thumbnail/200"></a>\n                        </div>\n                        <div class="detail">\n                            <h3>\n                                <a href="/product/detail/'+i.productId+'" '+u+">\n                                  "+l+d+" "+i.name+'\n                                </a>\n                            </h3>\n                            <p>\n                            <span class="price">¥ <strong>'+a+"</strong></span>\n                            <span>"+i.pageViews+'次浏览</span>\n                            <a class="fav '+m+'" href="javascript:;">'+h+"</a>\n                            </p>\n                            <p>\n                                "+s+" "+o+" "+r+" "+c+"\n                            </p>\n                        </div>\n                    </li>\n                "}),e}}),t.on("click",".fav",function(){var t=this;if(!window.isLogin)return location.href="/user/login?return="+location.pathname,!1;var e=$(this).parents("li").data("product-id");$(this).hasClass("add")?$.ajax({url:"/user/wish/edit/"+e}).then(function(e){e.success&&$(t).removeClass("add").text("收藏")}):$.ajax({url:"/user/wish/add/"+e}).then(function(e){e.success&&$(t).addClass("add").text("已收藏")})})}}},{"../common/utils":6}],"product-detail":[function(t,e,i){"use strict";var a=t("photoswipe"),n=t("photoswipe-ui"),o=t("../common/utils");e.exports={init:function(){function t(){$.ajax({url:"/shopping-cart/add",type:"post",data:{pid:$("#product-id").val(),count:1}}).then(function(t){console.info("成功添加到购物车!")},function(t){console.info("添加到购物车失败!",t)})}this.productId=$("#product-id").val(),this.favoriteProduct(),this.eventsGood(),this.eventsShare(),$(".am-slider").flexslider({directionNav:!1,slideshow:!1}),$("img.lazy-container").lazyload({container:$(".lazy-container-view")});var e=this,i=$(".detail-image"),a=i.find("img").length,n=0;i.find("img").each(function(t,o){o.onload=function(){n++;var t=$(o).width()/WIN_WIDTH;$(o).attr({"swipe-width":WIN_WIDTH,"swipe-height":$(o).height()/t}),n===a&&i.find("img").each(function(t,a){$(a).click(function(){e.createPhotoSwipe(i,t)})})}}),$("#tab-product-param").find("em").each(function(){if("date"==$(this).text()){var t=(new Date).getMonth()+1<=2?1:0;$(this).text((new Date).getFullYear()-t+"年")}});var o=$(".attachment-content");o.length&&o.find(".show").click(function(){o.hasClass("on")?(o.removeClass("on"),o.find(".am-icon-angle-up").removeClass("am-icon-angle-up").addClass("am-icon-angle-down")):(o.addClass("on"),o.find(".am-icon-angle-down").removeClass("am-icon-angle-down").addClass("am-icon-angle-up"))});var s=$("#buy"),r=$("#modal-buy"),c=$("#shop-link"),l=$(".open-tb-link"),d=$(".tb-name"),u=parseInt($("#product-method-id").val());if(c.val()){var m=new Clipboard(s[0],{text:function(){return c.val()}});m.on("success",function(e){r.find(".success").addClass("on"),r.find(".failed").removeClass("on"),r.modal(),t()})}else s.click(function(){r.find(".success").removeClass("on"),r.find(".failed").addClass("on"),r.modal(),t()});var h="";/http[^\s]+/.test(c.val())?(h=/(http[^\s]+)/.exec(c.val())[1],l.attr("href",h)):(l.attr("href",3===u?window.taobaoShop.shop1:window.taobaoShop.shop2),d.text(3===u?window.taobaoShop.shop1Name:window.taobaoShop.shop2Name))},favoriteProduct:function(){var t=$("#favorite"),e=$(".favorite-text"),i=$(".favorite-count");t.click(function(){if(!window.isLogin)return location.href="/user/login?return="+location.pathname,!1;var t=$(this).data("product-id"),a=parseInt(i.text());this.checked?$.ajax({url:"/user/wish/add/"+t}).then(function(t){t.success&&(e.parent().addClass("active"),e.text("已收藏"),i.text(a+1))}):$.ajax({url:"/user/wish/edit/"+t}).then(function(t){t.success&&(e.parent().removeClass("active"),e.text("收藏"),i.text(a-1))})})},createPhotoSwipe:function(t,e){var i=[];t.find("img").each(function(t,e){i.push({src:$(e).attr("data-original"),w:$(e).attr("swipe-width"),h:$(e).attr("swipe-height")})});var o={index:e},s=new a($(".pswp")[0],n,i,o);s.init()},eventsGood:function(){var t=this,e=$(".events-good");e.click(function(){if($(this).hasClass("active"))return!1;$(this).addClass("active");var e=$(this).find("em"),i=e.text()||0;0===i?e.text("( 1 )"):e.text(parseInt(i)+1),$.ajax({url:"/product/statistics/approval/"+t.productId})})},eventsShare:function(){var t=this,e=$(".events-share");e.click(function(){$(this).addClass("active"),$("body").append('<div class="share-bg"></div>'),$(".share-bg").click(function(){$(this).detach()}),$.ajax({url:"/product/statistics/share/"+t.productId})})},recommendProducts:function(t,e){for(var i=this,a=[],n=0;n<t.length;n++)for(var s=0;s<t[n].products.length;s++)a.push(t[n].products[s]);a.length>0&&$.ajax({type:"get",url:"/product/recommend/custom/"+a.join()}).then(function(a){for(var n=0;n<t.length;n++)for(var s=0;s<e.length;s++)t[n].productGroupId===e[s].productGroupId&&(t[n].name=e[s].productGroupName);for(var r=0;r<t.length;r++){t[r].html=[];for(var c=0;c<t[r].products.length;c++)for(var l=0;l<a.items.length;l++)a.items[l].productId===parseInt(t[r].products[c])&&t[r].html.push({productId:a.items[l].productId,name:a.items[l].name,image:o.productMainImageOutput(a.items[l].mainImage),price:a.items[l].price,isHot:a.items[l].isHot})}t=t.filter(function(t){return t.html.length}),i.recommendHtml(t)})},recommendHtml:function(t){var e=$(".recommend-content"),i="";$.each(t,function(t,e){i+='<div class="recommend"><h3>'+e.name+':</h3></div><div class="am-slider am-slider-default slider-recommend"><ul class="am-slides">',$.each(e.html,function(t,e){t%3===0&&(i+="<li>");var a=e.isHot?'<span class="hot"></span>':"",n=e.price?"<em>¥"+e.price+"</em>":"";i+='\n                    <dl>\n                        <dt>\n                            <a href="/product/detail/'+e.productId+'"><img src="'+e.image+'?imageMogr2/thumbnail/250" alt="'+e.name+'"></a>\n                            '+n+"\n                        </dt>\n                        <dd>"+a+e.name+"</dd>\n                    </dl>\n                "}),i+="</ul></div>"}),e.html(i),e.find(".am-slider").flexslider({directionNav:!1,slideshow:!1})}}},{"../common/utils":6,photoswipe:19,"photoswipe-ui":18}],order:[function(t,e,i){"use strict";e.exports={expressFun:function(){var t=$("#modal-search"),e=$("#modal-result");$(".search-tracking").click(function(){var i=$(this).data("tracking"),a=$(this).data("express");t.modal(),$.ajax({type:"get",url:"/order/express/query/"+i+"/"+a}).then(function(i){var a="";if(i.list)for(var n=0;n<i.list.length;n++){var o=n===i.list.length-1?"color-timeline-item-last":"",s=0===n?"green":"blue";a+='\n                            <li class="color-timeline-item '+o+'">\n                                <div class="color-timeline-item-tail"></div>\n                                <div class="color-timeline-item-head color-timeline-item-head-'+s+'"></div>\n                                <div class="color-timeline-item-content"><strong>'+i.list[n].time+"</strong> "+i.list[n].status+"</div>\n                            </li>\n                        "}else a='\n                        <li class="color-timeline-item color-timeline-item-last">\n                            <div class="color-timeline-item-tail"></div>\n                            <div class="color-timeline-item-head color-timeline-item-head-red"></div>\n                            <div class="color-timeline-item-content">'+i.msg+"</div>\n                        </li>\n                    ";t.modal("close"),e.find("ul").html(a),e.modal()},function(i){t.modal("close"),e.find("ul").html(i),e.modal()})})}}},{}],index:[function(t,e,i){"use strict";e.exports={indexFun:function(){function t(){$.each(r,function(t,e){return o>=e.top-120&&o<=e.height-120&&t!==c?(c=t,n.find(".active").removeClass("active"),void n.find("a").eq(t).addClass("active")):void 0})}var e=$(".home"),i=document.documentElement.clientHeight||document.body.clientHeight||0;e.height(i);var a=($(".content5"),$(".menu")),n=a.find("ul"),o=0;$(window).scroll(function(){var e=$(this).scrollTop();o=e,e>=i?a.addClass("active"):a.removeClass("active"),t()});var s=$("html,body"),r=[],c=0;$("div[data-target]").each(function(){var t=$(this).offset().top,e=$(this).height();$(this).attr({"data-top":t,"data-height":e}),r.push({top:t,height:e+t})}),$("a.link").click(function(){a.find(".active").removeClass("active"),$(this).addClass("active"),s.animate({scrollTop:parseInt($("div[data-target="+$(this).attr("data-link")+"]").attr("data-top"))-80})}),$('[data-toggle="popover"]').popover({trigger:"hover",html:!0})}}},{}],home:[function(t,e,i){"use strict";e.exports={init:function(){window.onload=function(){var t=$(".content1"),e=document.documentElement.clientHeight||document.body.clientHeight||0;t.height(e);var i=$(".menu"),a=i.find("ul"),n=0,o=$("html,body"),s=[],r=0;$("div[data-target]").each(function(){var t=$(this).offset().top,e=$(this).height();$(this).attr({"data-top":t,"data-height":e}),s.push({top:t,height:e+t})}),$(window).scroll(function(){var t=$(this).scrollTop();n=t,$.each(s,function(t,e){return n>=e.top&&n<=e.height&&t!==r?(r=t,a.find(".active").removeClass("active"),void a.find("a").eq(t+1).addClass("active")):void 0})}),$(".arrow").click(function(){i.find("a").eq(2).click()}),$("a.link").click(function(){i.find(".active").removeClass("active"),$(this).addClass("active"),o.animate({scrollTop:parseInt($("div[data-target="+$(this).attr("data-link")+"]").attr("data-top"))})})}}}},{}],cart:[function(t,e,i){"use strict";t("../common/utils");e.exports={init:function(){var t=$("#modal-buy");$(".shop-add-link").each(function(e,i){var a=new Clipboard(i,{text:function(){return $(i).data("shop-link")}});a.on("success",function(e){t.find(".success").addClass("on"),t.find(".failed").removeClass("on"),t.modal()})});var e=$("#modal-clear-cart");$("#clear-cart").click(function(){e.modal({relatedTarget:this,onConfirm:function(t){location.href="/shopping-cart?empty=true"}})})}}},{"../common/utils":6}],article:[function(t,e,i){"use strict";t("../common/utils");e.exports={initDesktop:function(){}}},{"../common/utils":6}]},{},[7]);