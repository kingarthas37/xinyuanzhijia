require=function e(n,t,o){function i(a,l){if(!t[a]){if(!n[a]){var s="function"==typeof require&&require;if(!l&&s)return s(a,!0);if(r)return r(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var c=t[a]={exports:{}};n[a][0].call(c.exports,function(e){var t=n[a][1][e];return i(t?t:e)},c,c.exports,e,n,t,o)}return t[a].exports}for(var r="function"==typeof require&&require,a=0;a<o.length;a++)i(o[a]);return i}({5:[function(e,n,t){"use strict";e("../../../../js/main"),e("./config"),e("./common"),e("./common-dom"),e("./utils"),e("./log")},{"../../../../js/main":17,"./common":2,"./common-dom":1,"./config":3,"./log":4,"./utils":6}],3:[function(e,n,t){"use strict";window.leanApp={AppID:"QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz",AppKey:"Wwh9RRHIySPlvToe3dsIVfS7",MasterKey:"mCIsLsrtOgujruzfcEGDm9Uh",api:"https://api.leancloud.cn/1.1/"},window.taobaoShop={shop1Name:"暮雪的心愿城",shop2Name:"亚特兰蒂斯之谜",shop1:"//muxue698.taobao.com",shop2:"//muxue928.taobao.com"}},{}],2:[function(e,n,t){"use strict";e("amazeui");Array.prototype.unique=function(){for(var e=[],n={},t=0;t<this.length;t++)n[this[t]]||(e.push(this[t]),n[this[t]]=1);return e},Array.prototype.remove=function(e){for(var n=0;n<this.length;n++){var t=this[n];if(isNaN(e)||(t=n),t==e){for(var o=n;o<this.length;o++)this[o]=this[o+1];this.length=this.length-1}}},$(function(){window.WIN_WIDTH=$(window).width(),window.WIN_HEIGHT=$(window).height(),window.leanAppHeader={"x-avoscloud-application-id":window.leanApp.AppID,"x-avoscloud-application-key":window.leanApp.AppKey,"content-type":"application/json"},window.isLogin=!!$.cookie("login"),window.globalVar={gLog:e("./log")};for(var n,t=function(){},o=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],i=o.length,r=window.console=window.console||{};i--;)n=o[i],r[n]||(r[n]=t);jQuery.validator.addMethod("isMobile",function(e,n){var t=e.length,o=/^1[0-9]{10}$/;return this.optional(n)||11==t&&o.test(e)},"请正确填写您的手机号码")})},{"./log":4,amazeui:8}],4:[function(e,n,t){"use strict";n.exports={_l:function(e){if(e){for(var n=e[0],t=1;t<e.length;t++)n=n.indexOf("%s")>-1?n.replace("%s",e[t]):n.replace("{}",e[t]);console.log(n)}},_serializeArguments:function(e){if(e){for(var n=e[0],t=1;t<e.length;t++)n=n.indexOf("%s")>-1?n.replace("%s",e[t]):n.replace("{}",e[t]);return n}},serializeArguments:function(e){return this._serializeArguments(Array.prototype.slice.apply(arguments))},log:function(e){this._l(Array.prototype.slice.apply(arguments))},info:function(e){this._l(Array.prototype.slice.apply(arguments))},debug:function(e){this._l(Array.prototype.slice.apply(arguments))},warn:function(e){var n=Array.prototype.slice.apply(arguments);n&&(n[0]="[warn]"+n[0]),this._l(n)},error:function(e){var n=Array.prototype.slice.apply(arguments);n&&(n[0]="[error]"+n[0]),this._l(n)},writeObjToJson:function(e){return JSON.stringify(e)}}},{}],1:[function(e,n,t){"use strict";e("bloodhound");$(function(){$(".go-back").click(function(){history.go(-1)}),$("img.lazy").lazyload();var e=$(".am-alert");e.length&&(e.fadeIn(),setTimeout(function(){return e.fadeOut()},2e3)),$.fn.setInfinitescroll=function(e){var n=$(this),t=$.extend({navSelector:".navigation",nextSelector:".navigation a",setPathParse:function(){},setData:function(){}},e||{});return n.infinitescroll({debug:!1,loading:{img:"//image.wish698.cn/35949f652a23d8e4958f.gif",msgText:"加载中...",speed:500},animate:!1,itemSelector:"li",navSelector:t.navSelector,nextSelector:t.nextSelector,dataType:"json",appendCallback:!1,pathParse:function(e,n){return t.setPathParse(e,n)}},function(e,o){if(!e.items.length){$("#infscr-loading").detach(),n.infinitescroll("unbind"),n.append('<div class="loading"></div>');var i=$('<div id="infscr-loading" style="display:none;">已加载全部内容</div>');return n.find(".loading").append(i),i.fadeIn(),setTimeout(function(){i.fadeOut()},3e3),!1}var r=$(t.setData(e));r.find("img.lazy").lazyload(),n.append(r)}),n}})},{bloodhound:9}]},{},[5]);
require=function t(e,i,a){function n(r,s){if(!i[r]){if(!e[r]){var c="function"==typeof require&&require;if(!s&&c)return c(r,!0);if(o)return o(r,!0);var l=new Error("Cannot find module '"+r+"'");throw l.code="MODULE_NOT_FOUND",l}var d=i[r]={exports:{}};e[r][0].call(d.exports,function(t){var i=e[r][1][t];return n(i?i:t)},d,d.exports,t,e,i,a)}return i[r].exports}for(var o="function"==typeof require&&require,r=0;r<a.length;r++)n(a[r]);return n}({7:[function(t,e,i){"use strict";t("../../../../js/main"),t("./home"),t("./order"),t("./index"),t("./user"),t("./product-list"),t("./product-detail"),t("./cart"),t("./article")},{"../../../../js/main":17,"./article":"article","./cart":"cart","./home":"home","./index":"index","./order":"order","./product-detail":"product-detail","./product-list":"product-list","./user":"user"}],user:[function(t,e,i){"use strict";e.exports={loginFun:function(){var t=$("#form"),e=$("#mobile"),i=$("#code"),a=$("#submit"),n=$("#referer");t.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(t,e){e.parents(".am-form-group").next().html(t)},submitHandler:function(t){var o=$(t);return o.data("state")?!1:(o.data("state",!0),a.prop("disabled",!0).text("登录中..."),void $.ajax({type:"post",url:"/user/login/to-login/"+$.trim(e.val())+"/"+$.trim(i.val())}).done(function(t){t.success?(a.text("登录成功!"),setTimeout(function(){location.href=n.val()},2e3)):(a.prop("disabled",!1).text("登录"),o.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),this.getSmsCode(e),e.on({keyup:function(){$.trim(this.value)?a.prop("disabled",!1):a.prop("disabled",!0)}})},userInfoFun:function(){var t=$("#form"),e=$("#submit"),i=$("#modal-confirm");t.validate({rules:{nickname:{required:!0},birthday:{dateISO:!0}},messages:{nickname:{required:"请输入您的用户名/昵称"},birthday:{dateISO:"请输入有效的日期 (1990/12/31)"}},errorPlacement:function(t){$(".message").html(t)},submitHandler:function(){e.prop("disabled",!0),$.ajax({type:"post",url:"/user/userinfo/edit",data:t.serialize()}).then(function(t){e.prop("disabled",!1),t.success&&(i.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3))},function(t){e.prop("disabled",!1),alert(t)})}})},mobileFun:function(){var t=$("#form"),e=$("#mobile"),i=$("#code"),a=$("#submit"),n=$("#modal-confirm"),o=$("#member-id");this.getSmsCode(e),t.validate({rules:{mobile:{required:!0,minlength:11,isMobile:!0},code:{required:!0,minlength:6,maxlength:6}},messages:{mobile:{required:"请输入您的手机号码",minlength:"请输入正确的手机号码",isMobile:"请输入正确的手机号码"},code:{required:"请输入6位数验证码",minlength:"请输入6位数验证码",maxlength:"请输入6位数验证码"}},errorPlacement:function(t,e){e.parents(".am-form-group").next().html(t)},submitHandler:function(t){var r=$(t);return r.data("state")?!1:(r.data("state",!0),a.prop("disabled",!0).text("更新中..."),void $.ajax({type:"post",url:"/user/mobile/update/"+$.trim(e.val())+"/"+$.trim(i.val())+"/"+o.val()}).done(function(t){t.success?(n.modal({closeViaDimmer:0}),setTimeout(function(){location.href="/"},3e3)):(a.prop("disabled",!1).text("更新/绑定手机号"),r.data("state",!1),i.parents(".am-form-group").next().html("验证码有误或已过期,请重新输入!"))}))}}),e.on({keyup:function(){$.trim(this.value)?a.prop("disabled",!1):a.prop("disabled",!0)}})},getSmsCode:function a(t){var a=$(".get-smscode"),e=a.find("a"),i=a.find("em"),n=i.find("b");e.click(function(){var e=$.trim(t.val());return e?/^1[0-9]{10}$/.test(e)?void(t.hasClass("valid")&&$.ajax({type:"get",url:"/user/login/get-smscode/"+e}).done(function(t){if(t.success){var e=59;n.text(e),a.addClass("on");var i=setInterval(function(){e--,n.text(e),0===e&&(clearInterval(i),a.removeClass("on"))},1e3)}else a.parents(".am-form-group").next().html("请求超时,请稍后再试!")})):($(".error-mobile").text("请输入正确的手机号码"),t[0].focus(),!1):(t[0].focus(),!1)})},wishFun:function(){$(".main-list").setInfinitescroll({setPathParse:function(t,e){var i=$(".navigation").find("a").attr("href");return i=i.replace(/(page=\d+)/,"page="),[i,""]},setData:function(t){var e="";return $.each(t.items,function(t,i){var a=i.price>0?i.price+".00":"-",n=function(){var t="";for(var e in i.mainImage)if(i.mainImage[e].isMainImage){t=i.mainImage[e].url;break}return t}(),o=i.stock>0?'<span class="active"><i class="am-icon-check"></i>现货</span>':"",r=i.isRefund?'<span class="active"><i class="am-icon-history"></i>7天退款</span>':"",s=i.isHandmade?'<span class="active"><i class="am-icon-modx"></i>纯手工</span>':"",c=i.isOnly?'<span class="active"><i class="am-icon-gavel"></i>只此一件 </span>':"",l=i.stock>0?"[现货]":"",d=i.isShortStock?"[缺货]":"",u=i.isShortStock?'class="out-stock"':"";e+='\n                    <li>\n                        <div class="img">\n                            <a href="/product/detail/'+i.productId+'"><img src="//image.wish698.cn/df9e62d1d9532ed9b308.png" class="lazy" width="100" height="100" data-original="'+n+'?imageMogr2/thumbnail/200"></a>\n                        </div>\n                        <div class="detail">\n                            <h3>\n                                <a href="/product/detail/'+i.productId+'" '+u+">\n                                  "+l+d+" "+i.name+'\n                                </a>\n                            </h3>\n                            <p>\n                            <span class="price">¥ <strong>'+a+"</strong></span>\n                            <span>"+i.pageViews+"次浏览</span>\n                            <span>已售"+i.sales+"件</span>\n                            </p>\n                            <p>\n                                "+r+" "+o+" "+s+" "+c+"\n                            </p>\n                        </div>\n                    </li>\n                "}),e}}),$(".main-list").on("click",".cancel-fav",function(){var t=this;return $.ajax({url:$(this).attr("href"),success:function(){$(t).parents("li").animate({opacity:0,height:0,padding:0})}}),!1})},footmarkFun:function(){}}},{}],"product-list":[function(t,e,i){"use strict";t("../common/utils");e.exports={init:function(){}}},{"../common/utils":6}],"product-detail":[function(t,e,i){"use strict";var a=t("photoswipe"),n=t("photoswipe-ui"),o=t("../common/utils");e.exports={init:function(){this.productId=$("#product-id").val();var t=$("#product-id").val();this.favoriteProduct(),this.eventsGood(),this.eventsShare(),$(".am-slider").flexslider({directionNav:!1,slideshow:!1});var e=this,i=$(".detail-image"),a=i.find("img").length,n=0;i.find("img").each(function(t,o){o.onload=function(){n++;var t=$(o).width()/WIN_WIDTH;$(o).attr({"swipe-width":WIN_WIDTH,"swipe-height":$(o).height()/t}),n===a&&i.find("img").each(function(t,a){$(a).click(function(){e.createPhotoSwipe(i,t)})})}}),$("#tab-product-param").find("em").each(function(){if("date"==$(this).text()){var t=(new Date).getMonth()+1<=2?1:0;$(this).text((new Date).getFullYear()-t+"年")}});var r=$(".attachment-content");r.length&&r.find(".show").click(function(){r.hasClass("on")?(r.removeClass("on"),r.find(".am-icon-angle-up").removeClass("am-icon-angle-up").addClass("am-icon-angle-down")):(r.addClass("on"),r.find(".am-icon-angle-down").removeClass("am-icon-angle-down").addClass("am-icon-angle-up"))});var s=$("#buy"),c=($("#modal-buy"),$("#shop-link")),l=$(".open-tb-link"),d=$(".tb-name"),u=parseInt($("#product-method-id").val());s.click(function(){if($.cookie("cart")){var e=[];e=$.cookie("cart").split(","),e.push(t);var i=[];e.forEach(function(t){i.includes(t)||i.push(t)}),i.push(t),$.cookie("cart",e.join(),{expires:new Date((new Date).getTime()+2592e6),path:o.getCookieUrl()})}else $.cookie("cart",[t].join(),{expires:new Date((new Date).getTime()+2592e6),path:o.getCookieUrl()});setTimeout(function(){location.href="/shopping-cart"},1e3)});var h="";/http[^\s]+/.test(c.val())?(h=/(http[^\s]+)/.exec(c.val())[1],l.attr("href",h)):(l.attr("href",3===u?window.taobaoShop.shop1:window.taobaoShop.shop2),d.text(3===u?window.taobaoShop.shop1Name:window.taobaoShop.shop2Name))},favoriteProduct:function(){var t=$("#favorite"),e=$(".favorite-text"),i=$(".favorite-count");t.click(function(){if(!window.isLogin)return location.href="/user/login?return="+location.pathname,!1;var t=$(this).data("product-id"),a=parseInt(i.text());this.checked?$.ajax({url:"/user/wish/add/"+t}).then(function(t){t.success&&(e.parent().addClass("active"),e.text("已收藏"),i.text(a+1))}):$.ajax({url:"/user/wish/edit/"+t}).then(function(t){t.success&&(e.parent().removeClass("active"),e.text("收藏"),i.text(a-1))})})},createPhotoSwipe:function(t,e){var i=[];t.find("img").each(function(t,e){i.push({src:$(e).attr("data-original"),w:$(e).attr("swipe-width"),h:$(e).attr("swipe-height")})});var o={index:e},r=new a($(".pswp")[0],n,i,o);r.init()},eventsGood:function(){var t=this,e=$(".events-good");e.click(function(){if($(this).hasClass("active"))return!1;$(this).addClass("active");var e=$(this).find("em"),i=e.text()||0;0===i?e.text("( 1 )"):e.text(parseInt(i)+1),$.ajax({url:"/product/statistics/approval/"+t.productId})})},eventsShare:function(){var t=this,e=$(".events-share");e.click(function(){$(this).addClass("active"),$("body").append('<div class="share-bg"></div>'),$(".share-bg").click(function(){$(this).detach()}),$.ajax({url:"/product/statistics/share/"+t.productId})})},recommendProducts:function(t,e){for(var i=this,a=[],n=0;n<t.length;n++)for(var r=0;r<t[n].products.length;r++)a.push(t[n].products[r]);a.length>0&&$.ajax({type:"get",url:"/product/recommend/custom/"+a.join()}).then(function(a){for(var n=0;n<t.length;n++)for(var r=0;r<e.length;r++)t[n].productGroupId===e[r].productGroupId&&(t[n].name=e[r].productGroupName);for(var s=0;s<t.length;s++){t[s].html=[];for(var c=0;c<t[s].products.length;c++)for(var l=0;l<a.items.length;l++)a.items[l].productId===parseInt(t[s].products[c])&&t[s].html.push({productId:a.items[l].productId,name:a.items[l].name,image:o.productMainImageOutput(a.items[l].mainImage),price:a.items[l].price,isHot:a.items[l].isHot})}t=t.filter(function(t){return t.html.length}),i.recommendHtml(t)})},recommendHtml:function(t){var e=$(".recommend-content"),i="";$.each(t,function(t,e){i+='<div class="recommend"><h3>'+e.name+':</h3></div><div class="am-slider am-slider-default slider-recommend"><ul class="am-slides">',$.each(e.html,function(t,e){t%3===0&&(i+="<li>");var a=e.isHot?'<span class="hot"></span>':"",n=e.price?"<em>¥"+e.price+"</em>":"";i+='\n                    <dl>\n                        <dt>\n                            <a href="/product/detail/'+e.productId+'"><img src="'+e.image+'?imageMogr2/thumbnail/250" alt="'+e.name+'"></a>\n                            '+n+"\n                        </dt>\n                        <dd>"+a+e.name+"</dd>\n                    </dl>\n                "}),i+="</ul></div>"}),e.html(i),e.find(".am-slider").flexslider({directionNav:!1,slideshow:!1})}}},{"../common/utils":6,photoswipe:19,"photoswipe-ui":18}],order:[function(t,e,i){"use strict";e.exports={expressFun:function(){var t=$("#modal-search"),e=$("#modal-result");$(".search-tracking").click(function(){var i=$(this).data("tracking"),a=$(this).data("express");t.modal(),$.ajax({type:"get",url:"/order/express/query/"+i+"/"+a}).then(function(i){var a="";if(i.list)for(var n=0;n<i.list.length;n++){var o=n===i.list.length-1?"color-timeline-item-last":"",r=0===n?"green":"blue";a+='\n                            <li class="color-timeline-item '+o+'">\n                                <div class="color-timeline-item-tail"></div>\n                                <div class="color-timeline-item-head color-timeline-item-head-'+r+'"></div>\n                                <div class="color-timeline-item-content"><strong>'+i.list[n].time+"</strong> "+i.list[n].status+"</div>\n                            </li>\n                        "}else a='\n                        <li class="color-timeline-item color-timeline-item-last">\n                            <div class="color-timeline-item-tail"></div>\n                            <div class="color-timeline-item-head color-timeline-item-head-red"></div>\n                            <div class="color-timeline-item-content">'+i.msg+"</div>\n                        </li>\n                    ";t.modal("close"),e.find("ul").html(a),e.modal()},function(i){t.modal("close"),e.find("ul").html(i),e.modal()})})}}},{}],index:[function(t,e,i){"use strict";e.exports={indexFun:function(){function t(){$.each(s,function(t,e){return o>=e.top-120&&o<=e.height-120&&t!==c?(c=t,n.find(".active").removeClass("active"),void n.find("a").eq(t).addClass("active")):void 0})}var e=$(".home"),i=document.documentElement.clientHeight||document.body.clientHeight||0;e.height(i);var a=($(".content5"),$(".menu")),n=a.find("ul"),o=0;$(window).scroll(function(){var e=$(this).scrollTop();o=e,e>=i?a.addClass("active"):a.removeClass("active"),t()});var r=$("html,body"),s=[],c=0;$("div[data-target]").each(function(){var t=$(this).offset().top,e=$(this).height();$(this).attr({"data-top":t,"data-height":e}),s.push({top:t,height:e+t})}),$("a.link").click(function(){a.find(".active").removeClass("active"),$(this).addClass("active"),r.animate({scrollTop:parseInt($("div[data-target="+$(this).attr("data-link")+"]").attr("data-top"))-80})}),$('[data-toggle="popover"]').popover({trigger:"hover",html:!0});var l=$("#input-product-search");$("#button-product-search").click(function(){location.href="/search?keywords="+$.trim(l.val())+"&limit=500&order=sales&stock=1"})}}},{}],home:[function(t,e,i){"use strict";e.exports={init:function(){window.onload=function(){var t=$(".content1"),e=document.documentElement.clientHeight||document.body.clientHeight||0;t.height(e);var i=$(".menu"),a=i.find("ul"),n=0,o=$("html,body"),r=[],s=0;$("div[data-target]").each(function(){var t=$(this).offset().top,e=$(this).height();$(this).attr({"data-top":t,"data-height":e}),r.push({top:t,height:e+t})}),$(window).scroll(function(){var t=$(this).scrollTop();n=t,$.each(r,function(t,e){return n>=e.top&&n<=e.height&&t!==s?(s=t,a.find(".active").removeClass("active"),void a.find("a").eq(t+1).addClass("active")):void 0})}),$(".arrow").click(function(){i.find("a").eq(2).click()}),$("a.link").click(function(){i.find(".active").removeClass("active"),$(this).addClass("active"),o.animate({scrollTop:parseInt($("div[data-target="+$(this).attr("data-link")+"]").attr("data-top"))})})}}}},{}],cart:[function(t,e,i){"use strict";var a=t("../common/utils");e.exports={init:function(){function t(){var t=[];i.find(".count").each(function(e,i){for(var a=parseInt($(this).text()),n=0;a>n;n++)t.push($(i).data("id"))}),$.cookie("cart",t.join(),{expires:new Date((new Date).getTime()+2592e6),path:a.getCookieUrl()}),console.log($.cookie("cart")),e()}function e(){var t=0;i.find(".price").each(function(){var e=$(this).parents("li"),i=parseInt($(this).text()),a=parseInt(e.find(".count").text());i*=a,t+=i}),n.html("<p>总金额：<strong>¥</strong><span>"+t+"</span></p>")}var i=$(".main-list"),n=$(".price-all");$("#send-product").click(function(){alert("请将购物页面截屏给客服即可")}),i.on("click",".delete",function(){$(this).parents("li").detach(),t()}),i.on("click",".count-plus",function(){var e=$(this).parents("li"),i=parseInt(e.find(".count").text());i++,e.find(".count").text(i),t()}),i.on("click",".count-minus",function(){var e=$(this).parents("li"),i=parseInt(e.find(".count").text());i>1?(i--,e.find(".count").text(i)):e.detach(),t()}),$.cookie("cart")?!function(){var t=$.cookie("cart").split(","),a=[],n={};t.forEach(function(t){a.includes(t)?n[t]++:(a.push(t),n[t]=1)});var o=function(t){$.ajax({url:"/shopping-cart/get-product",type:"get",data:{id:t}}).then(function(a){var o=function(){var t="";for(var e in a.data.mainImage)if(a.data.mainImage[e].isMainImage){t=a.data.mainImage[e].url;break}return t}();i.append('\n                     <li id="'+a.data.id+'">\n                        <div class="img">\n                            <a href="/product/detail/'+a.data.id+'"><img src="'+o+'" width="100" height="100" ></a>\n                        </div>\n                        <div class="detail">\n                            <h3>\n                                <a href="/product/detail/'+a.data.id+'" >\n                                   [ID:'+a.data.id+"] "+a.data.name+'\n                                </a>\n                            </h3>\n                            <div class="cart-dom">\n                                <p>\n                                    价格: ¥ <span class="price">'+a.data.price+'</span>\n                                    <span class="sp"></span>\n                                  \n                                    数量：<a href="javascript:;" class="count-dom count-minus">-</a> <span class="count" data-id="'+a.data.id+'">'+n[t]+'</span> <a href="javascript:;" class="count-dom count-plus">+</a>\n                                    <span class="sp"></span>\n                                    <a href="javascript:;" class="delete">[删除]</a>\n                                </p>\n                            </div>\n                            \n                          </div>\n                       </li>\n                    \n                    '),e()},function(t){console.log(t)})};for(var r in n)o(r)}():$(".cart-empty-info").html('<p>购物车为空! <a href="/index">立即去加购商品</a></p>');var o=$("#modal-clear-cart");$("#clear-cart").click(function(){o.modal({relatedTarget:this,onConfirm:function(t){$.cookie("cart","",{expires:new Date((new Date).getTime()),path:a.getCookieUrl()}),location.href="/shopping-cart"}})})}}},{"../common/utils":6}],article:[function(t,e,i){"use strict";t("bloodhound"),t("../common/utils");e.exports={initDesktop:function(){var t=$(".main-list");t.setInfinitescroll({setPathParse:function(t,e){var i=$(".navigation").find("a").attr("href");return i=i.replace(/(page=\d+)/,"page="),[i,""]},setData:function(t){var e="";return $.each(t.items,function(t,i){e+='\n                        <li>\n                            <div class="content">\n                                <div class="main-img">\n                                    <a href="/blog/'+i.articleId+'"><img width="260" height="260" src="'+i.image+'" alt="'+i.name+'"></a>\n                                </div>\n                                <div class="title">\n                                    <a href="/blog/'+i.articleId+'">'+i.name+'</a>\n                                </div>\n                                <div class="info">\n                                    <div class="left">\n                \n                                    </div>\n                                    <div class="right">\n                                        <span>人气:99</span>\n                                        <span class="split"></span>\n                                        <span>日期:2018/5/24</span>\n                                    </div>\n                                </div>\n                            </div>\n                        </li>\n                '}),e}}),$(".crumb .tags").each(function(t,e){var i=this,a=$(this).data("id");$.ajax({url:"/admin/article/article-category-count/"+a}).done(function(t){$(i).find("em").text("("+t.count+")")})})},initDetailMobile:function(){this.articleId=$(".child-detail-content").attr("data-id");var t=$(".child-detail-content"),e=t.attr("data-id"),i='\n                <div class="child-detail">\n                    <h3>阅读所有子文章</h3>\n                    <ul>\n                    </ul>\n                </div>\n            ';$.ajax({url:"/admin/article/seed/"+e}).done(function(e){e.list.article&&(t.append(i),$.each(e.list.article,function(e,i){t.find("ul").append('<li><a href="/blog/'+i.articleId+'">'+i.name+"</a></li>")}))}),this.eventsGood(),this.eventsShare(),this.favoriteProduct()},favoriteProduct:function(){var t=$("#favorite"),e=$(".favorite-text"),i=$(".favorite-count");t.click(function(){if(!window.isLogin)return location.href="/user/login?return="+location.pathname,!1;var t=$(this).data("article-id"),a=parseInt(i.text());this.checked?$.ajax({url:"/user/wish/article/add/"+t}).then(function(t){t.success&&(e.parent().addClass("active"),e.text("已收藏"),i.text(a+1))}):$.ajax({url:"/user/wish/article/edit/"+t}).then(function(t){t.success&&(e.parent().removeClass("active"),e.text("收藏"),i.text(a-1))})})},eventsGood:function(){var t=this,e=$(".events-good");e.click(function(){if($(this).hasClass("active"))return!1;$(this).addClass("active");var e=$(this).find("em"),i=e.text()||0;0===i?e.text("( 1 )"):e.text(parseInt(i)+1),$.ajax({url:"/blog/statistics/approval/"+t.articleId})})},eventsShare:function(){var t=this,e=$(".events-share");e.click(function(){$(this).addClass("active"),$("body").append('<div class="share-bg"></div>'),$(".share-bg").click(function(){$(this).detach()}),$.ajax({url:"/blog/statistics/share/"+t.articleId})})},searchFun:function(){var t=$(".search-go-panel"),e=$("#search-box"),i=$(".search-close").find("a"),a=$("#search-input");t.click(function(){e.offCanvas("open")}),i.click(function(){e.offCanvas("close")}),e.on("open.offcanvas.amui",function(){a[0].focus()});var n=$.cookie("search-article-result"),o=$("#search-input"),r=$(".search-history ul"),s=$(".search-form"),c=[];n?(c=n.split(","),$.each(c,function(t,e){e=decodeURIComponent(e),r.append('<li><a href="/blog?keywords='+e+'">'+e+"</a></li>")})):r.append('<li><a class="color-gray" href="javascript:;">无搜索记录</a></li>'),s.submit(function(){var t=$.trim(o.val());c.unshift(t),c=c.unique(),c.length>5&&(c.length=5),$.cookie("search-article-result",c.join(),{expires:new Date((new Date).getTime()+2592e6),path:"/"})}),$(".clear-history").click(function(){return r.find("li").length?(r.find("li").detach(),void $.cookie("search-article-result","",{expires:new Date((new Date).getTime()),path:"/"})):!1})}}},{"../common/utils":6,bloodhound:9}]},{},[7]);