require=function e(n,t,o){function r(i,c){if(!t[i]){if(!n[i]){var u="function"==typeof require&&require;if(!c&&u)return u(i,!0);if(a)return a(i,!0);var l=new Error("Cannot find module '"+i+"'");throw l.code="MODULE_NOT_FOUND",l}var s=t[i]={exports:{}};n[i][0].call(s.exports,function(e){var t=n[i][1][e];return r(t?t:e)},s,s.exports,e,n,t,o)}return t[i].exports}for(var a="function"==typeof require&&require,i=0;i<o.length;i++)r(o[i]);return r}({3:[function(e,n,t){"use strict";e("../../../../js/main"),e("./config"),e("./common")},{"../../../../js/main":16,"./common":1,"./config":2}],2:[function(e,n,t){"use strict";var o="51wish";window.env=function(){return location.hostname===o+".leanapp.cn"||location.hostname===o+".cn"||location.host==="www."+o+".cn"?"production":location.hostname==="stg-"+o+".leanapp.cn"?"stage":"development"};var r=function(){return"production"===env()?"//51wish.cn/1.1/functions/":"stage"===env()?"//stg-51wish.leanapp.cn/1.1/functions/":"/1.1/functions/"};window.leanApp={appdId:"QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz",api:"https://leancloud.cn/1.1/",cloud:r()},window.leanAppHeader={"x-lc-id":leanApp.appdId,"x-lc-sign":$.cookie("x_lc_sign")||"","x-lc-session":$.cookie("x_lc_session")||"","x-lc-prod":"production"===env()?1:0,"content-type":"application/json"}},{}],1:[function(e,n,t){"use strict";var o=e("amazeui");$(function(){for(var e,n=function(){},t=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],r=t.length,a=window.console=window.console||{};r--;)e=t[r],a[e]||(a[e]=n);$.extend($.validator.messages,{required:"必选字段",remote:"请修正该字段",email:"请输入正确格式的电子邮件",url:"请输入合法的网址",date:"请输入合法的日期",dateISO:"请输入合法的日期 (ISO).",number:"请输入合法的数字",digits:"只能输入整数",creditcard:"请输入合法的信用卡号",equalTo:"请再次输入相同的值",accept:"请输入拥有合法后缀名的字符串",maxlength:jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),minlength:jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),rangelength:jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),range:jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),max:jQuery.validator.format("请输入一个最大为{0} 的值"),min:jQuery.validator.format("请输入一个最小为{0} 的值")}),o.plugin("amuiSelected",o.selected),$("[data-am-selected]").amuiSelected(),$(".am-alert.am-alert-success").length&&setTimeout(function(){$(".am-alert.am-alert-success").hide()},3e3),$(".btn-back").click(function(){history.back(-1)})})},{amazeui:7}]},{},[3]);
require=function t(e,a,n){function o(i,d){if(!a[i]){if(!e[i]){var c="function"==typeof require&&require;if(!d&&c)return c(i,!0);if(r)return r(i,!0);var s=new Error("Cannot find module '"+i+"'");throw s.code="MODULE_NOT_FOUND",s}var u=a[i]={exports:{}};e[i][0].call(u.exports,function(t){var a=e[i][1][t];return o(a?a:t)},u,u.exports,t,e,a,n)}return a[i].exports}for(var r="function"==typeof require&&require,i=0;i<n.length;i++)o(n[i]);return o}({5:[function(t,e,a){"use strict";t("../../../../js/main"),t("./product"),t("./product-category"),t("./product-method"),t("./product-preview"),t("./product-property"),t("./product-brand"),t("./product-groups"),t("./product-groups-name"),t("./upload"),t("./sign")},{"../../../../js/main":16,"./product":"product","./product-brand":"product-brand","./product-category":"product-category","./product-groups":"product-groups","./product-groups-name":"product-groups-name","./product-method":"product-method","./product-preview":"product-preview","./product-property":"product-property","./sign":"sign","./upload":"upload"}],upload:[function(t,e,a){"use strict";e.exports={uploadFile:function(t){var e=$("#form-upload"),a=$("#file"),n=$(".upload-loading"),o=$(".am-btn"),r=$(".text"),i=t.fileType,d=t.callbackName;e.submit(function(){return n.addClass("on"),o.removeClass("am-btn-primary").addClass("am-btn-default").prop("disabled",!0),r.text("正在上传..."),a.hide(),$(this).ajaxSubmit({data:{fileType:i},success:function(t){a.val(""),n.removeClass("on"),o.addClass("am-btn-primary").removeClass("am-btn-default").prop("disabled",!1),r.text("选择要上传的文件"),a.show(),t.success?window.parent[d](t.data):alert(t.error)}}),!1}),a.change(function(){this.value&&e.submit()})}}},{}],sign:[function(t,e,a){"use strict";t("jquery-validate"),e.exports={loginFun:function(){this.submitControl()},registerFun:function(){this.submitControl()},submitControl:function(){var t=$("#submit");$(".am-form").validator({submit:function(){return this.isFormValid()?void t.attr("disabled",!0).addClass("am-disabled"):!1}})}}},{"jquery-validate":15}],"product-property":[function(t,e,a){"use strict";var n=(window.leanAppHeader,t("bloodhound"));e.exports={init:function(){return location.search.indexOf("viewport=window")>-1&&!location.hash&&window.parent.closeViewportModal?void window.parent.closeViewportModal():(this.setContentDisplay(),this.setPurchaseLinkContent(),this.setShopLinkContent(),this.setStockContent(),this.setSettingsContent(),this.setContentManage(),void this.setImageSourceLink())},setContentDisplay:function(){if(location.hash){var t=$("#"+location.hash.substring(1));t.length&&(t.addClass("am-active"),t.find(".am-collapse").addClass("am-in"))}},setPurchaseLinkContent:function(){"#purchase-link"===location.hash&&setTimeout(function(){return $("input[name=purchase-link]").get(0).focus()},0)},setShopLinkContent:function(){"#shop-link"===location.hash&&setTimeout(function(){return $("input[name=shop-link]").get(0).focus()},0)},setStockContent:function(){var t=$("#stock"),e=t.find("select[name=stock]"),a=t.find("[name=sales]"),n=t.find(".stock-minus"),o=t.find(".stock-plus"),r=$(".stock-reset");n.click(function(){var t=parseInt(e.val()),n=parseInt(a.val());t>0&&(e.find("option[value="+(t-1)+"]")[0].selected=!0,a.val(n+1))}),o.click(function(){var t=parseInt(e.val());e.find("option[value="+(t+1)+"]")[0].selected=!0}),r.click(function(){e.find("option[value="+e.data("stock")+"]")[0].selected=!0,a.val(a.data("sales"))})},setSettingsContent:function(){"#settings"===location.hash&&setTimeout(function(){return $("input[name=price]").get(0).focus()},0)},setContentManage:function(){var t=$("#brand-id"),e=$("[name=brand-id]");t.typeahead(null,{limit:10,display:function(t){return t.value},templates:{suggestion:function(t){return"<div>"+t.value+"</div>"}},highlight:!0,source:new n({datumTokenizer:n.tokenizers.obj.whitespace("value"),queryTokenizer:n.tokenizers.whitespace,remote:{url:"/admin/product-brand/ajax/search",prepare:function(e,a){return a.data={name:t.val()},a}}})}),t.on({"typeahead:select":function(t,a){var n=/\{id\:(\d+)\}/.exec(a.value)[1];e.val(n)}})},setImageSourceLink:function(){var t=$(".image-source-download"),e=$("textarea[name=image-source]").val().split("\n"),a=$("#product-id").val();e.length&&$.each(e,function(e,n){t.append('<a href="'+n+'" download="下载.'+a+"."+(e+1)+'">下载'+(e+1)+"</a> ")})}}},{bloodhound:8}],"product-preview":[function(t,e,a){"use strict";var n=t("../common/utils");e.exports={init:function(t){this.settings=t,this.updateDom(),this.waterMark(),this.screenShot(),this.screenShotRecommend()},btnCopy:function o(){var t=$(".preview-content"),e=$.trim(t.html()),o=$(".btn-copy"),a=new Clipboard(o[0],{text:function(){return e}});a.on("success",function(t){o.popover({content:"复制成功!"})})},updateDom:function(){$(".preview-content").find("em").each(function(){"date"===$.trim($(this).text())&&$(this).parents("li").detach()})},waterMark:function(){var t=$(".preview-content").find("div img");t.each(function(){var t=this.src;$(this).data("src-source",t.replace(/\?.+/,"")),$(this).data("src-target",t)}),$(".disable-watermark").click(function(){this.checked?t.each(function(){$(this).attr("src",$(this).data("src-source"))}):t.each(function(){$(this).attr("src",$(this).data("src-target"))})})},screenShot:function(){var t=$(".preview-content"),e="<style>\n            body { margin:0; width:750px; background: #fff;  font-family:'Segoe UI','Lucida Grande','Helvetica','Arial','Microsoft YaHei'; font-size: 20px; line-height: 30px; }\n            section { padding: 0; margin: 0 0 20px 0; }\n            section img { margin:0;}\n            div { padding: 0 15px; margin-bottom: 20px;}\n            ul {margin: 0 0 15px 0;padding: 0 0 0 20px;}\n            img { width: 100%; margin-bottom: 20px; }\n            p { margin: 0 0 15px 0; padding: 0;}\n        </style>",a=t.html(),n=$(".btn-shot");-1===location.href.indexOf("localhost")&&(n.hide(),$(".btn-shot-recommend").hide()),n.button("loading");var o=$.AMUI.progress;window.onload=function(){n.button("reset"),n.click(function(){o.start(),n.button("loading").text("图片生成中..."),$.ajax({url:"/admin/product/preview/shot",type:"post",data:{html:e+a,segmentHeight:480,htmlHeight:t.height(),name:"产品-"+$("h4").text().replace(/\//g,"")},success:function(){o.done(),$("#modal-shot-success").modal(),n.button("reset").text("生成淘宝详情图片")}})})}},recommendProducts:function(t,e){for(var a=this,o=[],r=0;r<t.length;r++)for(var i=0;i<t[r].products.length;i++)o.push(t[r].products[i]);$.ajax({type:"get",url:"/product/recommend/custom/"+o.join()}).then(function(o){for(var r=0;r<t.length;r++)for(var i=0;i<e.length;i++)t[r].productGroupId===e[i].productGroupId&&(t[r].name=e[i].productGroupName);for(var d=0;d<t.length;d++){t[d].html=[];for(var c=0;c<t[d].products.length;c++)for(var s=0;s<o.items.length;s++)o.items[s].productId===parseInt(t[d].products[c])&&t[d].html.push({productId:o.items[s].productId,name:o.items[s].name,image:n.productMainImageOutput(o.items[s].mainImage),price:o.items[s].price,isHot:o.items[s].isHot,shopLink:o.items[s].shopLink})}t=t.filter(function(t){return t.html.length}),a.recommendHtml(t)})},recommendHtml:function(t){var e=$(".recommend-content"),a="";$.each(t,function(t,e){a+='<h3 class="item">'+e.name+":</h3><div>",$.each(e.html,function(t,e){var n=e.shopLink[0]?'<a target="_blank" href="'+e.shopLink[0]+'">':"";a+='\n                    <dl class="item">\n                        '+n+'\n                        <dt><img src="'+e.image+'?imageMogr2/thumbnail/90"></dt>\n                        <dd>'+e.name+"</dd>\n                        "+(n?"</a>":"")+"\n                    </dl>\n                "}),a+="</div>"}),e.append(a);var n=0;e.find("img").each(function(t,a){var o=e.find("img").length;this.onload=function(){n++,n===o&&$(".btn-shot-recommend").button("reset")}})},screenShotRecommend:function(){var t=$(".btn-shot-recommend");if(t.length){var e="<style>\n            body { margin:0; width:750px; background: #fff;  font-family:'Segoe UI','Lucida Grande','Helvetica','Arial','Microsoft YaHei'; }  \n            h3 { height:100px; line-height: 100px; margin:0; font-size:24px; padding-left:15px; }\n            dl { margin:0; }\n            dl:before { content: ' ';display: table;}\n            dl:after { content: ' ';display: table; clear: both; }\n            dt { margin:0; float:left; text-align: center; width: 120px; height: 100px;}\n            dd { color:#666; float:left; margin:0; font-size:20px; width: 630px; height: 100px; line-height: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n            dl img { margin-top:5px; width: 90px; height: 90px; border-radius: 5px; }\n            a dd { color:#333;  text-decoration: underline;}\n        </style>",a=$(".recommend-content");t.button("loading");var n=$.AMUI.progress;t.click(function(){n.start();var o=a.html();t.button("loading").text("图片生成中..."),$.ajax({url:"/admin/product/preview/shot",type:"post",data:{html:e+o,htmlHeight:100*(a.find("dl").length+a.find("h3").length),segmentHeight:100,name:"推荐-"+$("h4").text().replace(/\//g,"")},success:function(){n.done(),$("#modal-shot-success").modal(),t.button("reset").text("生成推荐产品图片")}})}),!function(){var t=$(".recommend-code"),e=$(".btn-recommend-code-copy"),n=$(".recommend-code-hidden"),o="";$(".btn-recommend-code").click(function(){if(o="",n.html(t.val()),n.find("img").length!==a.find(".item").length)return alert("图片数量不一致,请重新输入!"),!1;for(var r=0;r<n.find("img").length;r++)if(-1===n.find("img").eq(r).attr("src").indexOf("alicdn"))return alert("图片地址有误,请重新输入!"),!1;$(this).removeClass("am-btn-primary").addClass("am-btn-success"),e.removeClass("am-btn-success").addClass("am-btn-primary"),o='<div><img src="https://img.alicdn.com/imgextra/i4/42879206/TB2Dw47p9BjpuFjSsplXXa5MVXa_!!42879206.png"></div>',a.find(".item").each(function(t,e){var a='<img src="'+n.find("img").eq(t).attr("src")+'"/>';o+=$(e).find("a").length?'<a href="'+$(e).find("a").attr("href")+'">'+a+"</a>":a}),n.html(o)});var r=new Clipboard(e[0],{text:function(){return o}});r.on("success",function(t){e.removeClass("am-btn-primary").addClass("am-btn-success")})}()}}}},{"../common/utils":4}],"product-method":[function(t,e,a){"use strict";window.leanAppHeader;e.exports={indexFun:function(){var t=$(".remove-product-method"),e=$("#confirm-remove-product-method"),a=$("#modal-alert");a.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),t.click(function(){e.modal({relatedTarget:this,onConfirm:function(){var t=$(this.relatedTarget),n=parseInt(t.data("id"));return t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.ajax({type:"post",url:"/admin/product-method/remove/"+n,success:function(n){t.data("state",!1),$.AMUI.progress.done(),e.modal("close"),n.success?a.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("删除产品类型成功!"):a.modal().find(".am-modal-bd").text(n.message)}}),!1)}})})},addFun:function(){this.submitControl()},editFun:function(){this.submitControl()},submitControl:function(){var t=$("#submit");$(".am-form").validator({submit:function(){return this.isFormValid()?void t.attr("disabled",!0).addClass("am-disabled"):!1}})}}},{}],"product-groups-name":[function(t,e,a){"use strict";window.leanAppHeader;e.exports={indexFun:function(){var t=$(".remove-product-group"),e=$("#confirm-remove-product-group"),a=$("#modal-alert");a.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),t.click(function(){e.modal({relatedTarget:this,onConfirm:function(){var t=$(this.relatedTarget),n=parseInt(t.data("id"));return t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.ajax({type:"post",url:"/admin/product-group/remove/"+n,success:function(n){t.data("state",!1),$.AMUI.progress.done(),e.modal("close"),n.success?a.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("删除产品组合类型成功!"):a.modal().find(".am-modal-bd").text(n.message)}}),!1)}})})},addFun:function(){this.submitControl()},editFun:function(){this.submitControl()},submitControl:function(){var t=$("#submit");$(".am-form").validator({submit:function(){return this.isFormValid()?void t.attr("disabled",!0).addClass("am-disabled"):!1}})}}},{}],"product-groups":[function(t,e,a){"use strict";var n=t("./product/autocomplete-product-name");t("../common/utils");e.exports={indexFun:function(){var t=$("#product-id").val(),e=$("#product-method-id").val(),a=$("#category1-id").val(),o=$("#category2-id").val(),r=$("#form-edit-groups"),i=$(".product-name");i.each(function(t,e){/\d+/.test(e.value)&&n.getId(e,e.value,function(){n.getName(e)})});var d='\n            <div class="am-form-group">\n                <div class="input">\n                    <input class="product-name" type="text" placeholder="输入产品名称(自动填充)" autocomplete="off">\n                </div>\n                <div class="del">\n                    <a href="javascript:;">- 删除</a>\n                </div>\n            </div>\n        ';$(".product-group-add").click(function(){var t=$(this).parents(".product-group"),e=t.find(".list-group-field");e.append(d),n.getName(t.find(".product-name:last")),t.find(".product-name:last")[0].focus()}),r.on("click",".del a",function(){$(this).parent().parent().detach()}),$("#submit").click(function(){var n=$(this),r=[];return $(".product-group").each(function(t,e){r.push({}),r[t].productGroupId=$(e).data("group-id"),r[t].products=[];var a=$(e).find(".product-name").filter(function(){return!$(this).attr("readonly")});a.each(function(e,a){if(/\{id\:\d+\}/.test(a.value)){var n=/\{id\:(\d+)\}/.exec(a.value)[1];r[t].products.push(n)}})}),n.prop("disabled",!0),$.ajax({url:"/admin/product/groups/"+t,type:"post",data:{groups:JSON.stringify(r)}}).then(function(t){return t.success?location.href="/admin/product?product-method-id="+e+"&category1-id="+a+"&category2-id="+o:void n.prop("disabled",!1)}),!1})}}},{"../common/utils":4,"./product/autocomplete-product-name":6}],6:[function(t,e,a){"use strict";var n=t("bloodhound");e.exports={getName:function(t){var e=$(t);e.typeahead(null,{display:function(t){return t.value},templates:{suggestion:function(t){return'<div><img src="'+t.image+'?imageMogr2/thumbnail/32" />'+t.value+" </div>"}},highlight:!0,source:new n({datumTokenizer:n.tokenizers.obj.whitespace("value"),queryTokenizer:n.tokenizers.whitespace,remote:{url:"/admin/product/get-product",prepare:function(t,a){return a.data={name:e.val()},a}}})})},getId:function(t,e,a){$.ajax({url:"/admin/product/get-id/"+e,type:"get"}).then(function(n){n.success&&(t.value=n.result.name+" {id:"+e+"}",a())})}}},{bloodhound:8}],"product-category":[function(t,e,a){"use strict";e.exports={indexFun:function(){this.container=$(".am-accordion"),this.selectProductMethod(),this.addCategory1(),this.editCategory1(),this.removeCategory1(),this.moveCategory1Up(),this.moveCategory1Down(),this.addCategory2(),this.editCategory2(),this.removeCategory2(),this.moveCategory2Up(),this.moveCategory2Down()},selectProductMethod:function(){var t=$(".select-product-method");this.productMethodId=t.val()?parseInt(t.val()):0,t.change(function(){location.href="/admin/product-category?product-method-id="+this.value})},addCategory1:function(){var t=$("#modal-category-1-add"),e=$("#input-category-1-add"),a=$("#modal-category-1-confirm-add"),n=this.productMethodId;$(".btn-category-1-add").click(function(){e.val(""),t.modal({relatedTarget:this})}),a.click(function(){return a.data("state")?!1:($.AMUI.progress.start(),a.data("state",!0),$.post({url:leanApp.api+"classes/ProductCategory1",headers:leanAppHeader,data:JSON.stringify({index:$(".am-accordion-item").length,name:$.trim(e.val())?$.trim(e.val()):"无分类名",productMethodId:n}),success:function(){$.AMUI.progress.done(),a.data("state",!1),t.modal("close"),location.reload()}}),!1)})},editCategory1:function(){var t=$("#modal-category-1-edit"),e=$("#input-category-1-edit"),a=$("#modal-category-1-confirm-edit"),n=$("#modal-alert"),o=this.productMethodId,r=null;$(".edit-category-1").each(function(){$(this).click(function(){var a=$(this).parents(".am-accordion-title").find("strong").text();return e.val($.trim(a)),t.modal({relatedTarget:this}),r=$(this).parents(".am-accordion-item").attr("data-id"),!1})}),a.click(function(){return a.data("state")?!1:($.AMUI.progress.start(),a.data("state",!0),$.get({url:leanApp.api+"classes/ProductCategory1",headers:leanAppHeader,data:'where={"category1Id":'+r+"}"}).done(function(t){return $.ajax({type:"PUT",url:leanApp.api+"classes/ProductCategory1/"+t.results[0].objectId,headers:leanAppHeader,data:JSON.stringify({name:$.trim(e.val()),productMethodId:o})})}).done(function(){a.data("state",!1),$.AMUI.progress.done(),t.modal("close"),n.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("编辑一级分类成功!")}),!1)})},removeCategory1:function(){var t=$(".remove-category-1"),e=$("#modal-category-1-remove"),a=$("#modal-alert"),n=this.productMethodId;a.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),t.each(function(t,o){$(o).click(function(){$(this);return e.modal({relatedTarget:this,onConfirm:function(){var t=$(this.relatedTarget);return t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/remove-category-1",data:{productMethodId:n,id:t.parents(".am-accordion-item").attr("data-id")},success:function(n){t.data("state",!1),$.AMUI.progress.done(),e.modal("close"),n.success?a.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("删除一级分类成功!"):a.modal().find(".am-modal-bd").text(n.message)}}),!1)}}),!1})})},moveCategory1Up:function(){$(".moveup-category-1").each(function(){$(this).click(function(){var t=$(this),e=t.parents(".am-accordion-item"),a=e.prev(),n=e.attr("data-id"),o=a.attr("data-id"),r=e.index();return 0===r?!1:t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-1-up",data:{currentId:n,targetId:o}}).done(function(n){n.success&&(e.after(a),t.data("state",!1),$.AMUI.progress.done())}),!1)})})},moveCategory1Down:function(){var t=$(".am-accordion-item");$(".movedown-category-1").each(function(){$(this).click(function(){var e=$(this),a=e.parents(".am-accordion-item"),n=a.next(),o=a.attr("data-id"),r=n.attr("data-id"),i=a.index();return i===t.length-1?!1:e.data("state")?!1:(e.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-1-down",data:{currentId:o,targetId:r}}).done(function(t){t.success&&(a.before(n),e.data("state",!1),$.AMUI.progress.done())}),!1)})})},addCategory2:function(){var t=$("#modal-category-2-add"),e=$("#input-category-2-add"),a=$("#modal-category-2-confirm-add"),n=null,o=null;$(".btn-category-2-add").each(function(a,r){$(r).click(function(){n=$(this).parents(".am-accordion-item"),o=parseInt(n.attr("data-id")),e.val(""),t.modal({relatedTarget:this})})}),a.click(function(){if(a.data("state"))return!1;$.AMUI.progress.start(),a.data("state",!0);var r=n.find(".category-2-list li").length;return $.post({url:"/admin/product-category/add-category-2",data:{index:r,name:$.trim(e.val())?$.trim(e.val()):"无标题",category1Id:o}}).done(function(e){$.AMUI.progress.done(),a.data("state",!1),t.modal("close");var o=$(".select-product-method").val(),r=n.data("id");n.find(".category-2-list").append('\n                        <li data-id="'+e.id+'">\n                            <strong>\n                            <a href="/admin/product?product-method-id='+o+"&category1-id="+r+"&category2-id="+e.id+'" target="_blank">'+e.name+'</a>\n                            </strong>\n                            <span class="options">\n                                <a href="/admin/product/add?product-method-id='+o+"&category1-id="+r+"&category2-id="+e.id+'" target="_blank">新建</a>\n                                <a class="edit-category-2" href="javascript:;">编辑</a>\n                                <a class="moveup-category-2" href="javascript:;">上移</a>\n                                <a class="movedown-category-2" href="javascript:;">下移</a>\n                                <a class="remove-category-2" href="javascript:;">删除</a>\n                            </span>\n                        </li>\n                ')}),!1})},editCategory2:function(){var t=$("#modal-category-2-edit"),e=$("#input-category-2-edit"),a=$("#modal-category-2-confirm-edit"),n=$("#modal-alert"),o=null,r=null;this.container.on("click",".edit-category-2",function(){return o=$(this).parents("li"),e.val($.trim(o.find("strong").text())),r=o.attr("data-id"),t.modal({relatedTarget:this}),!1}),a.click(function(){return a.data("state")?!1:($.AMUI.progress.start(),a.data("state",!0),$.get({url:leanApp.api+"classes/ProductCategory2",headers:leanAppHeader,data:'where={"category2Id":'+r+"}"}).done(function(t){return $.ajax({type:"PUT",url:leanApp.api+"classes/ProductCategory2/"+t.results[0].objectId,headers:leanAppHeader,data:JSON.stringify({name:$.trim(e.val())})})}).done(function(){a.data("state",!1),$.AMUI.progress.done(),t.modal("close"),n.modal({onConfirm:function(){return o.find("strong a").text(e.val())}}).find(".am-modal-bd").text("编辑二级分类成功!")}),!1)})},removeCategory2:function(){var t=$("#modal-category-2-remove"),e=$("#modal-alert");e.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),this.container.on("click",".remove-category-2",function(){return t.modal({relatedTarget:this,onConfirm:function(){var a=$(this.relatedTarget),n=a.parents("li");return a.data("state")?!1:(a.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/remove-category-2",data:{category1Id:n.parents(".am-accordion-item").attr("data-id"),category2Id:n.attr("data-id")},success:function(o){a.data("state",!1),$.AMUI.progress.done(),t.modal("close"),o.success?e.modal({onConfirm:function(){return n.detach()}}).find(".am-modal-bd").text("删除二级分类成功!"):e.modal().find(".am-modal-bd").text(o.message)}}),!1)}}),!1})},moveCategory2Up:function(){this.container.on("click",".moveup-category-2",function(){var t=$(this),e=$(this).parents("li"),a=e.attr("data-id"),n=e.prev(),o=n.attr("data-id"),r=e.index();return 0===r?!1:t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-2-up",data:{currentId:a,targetId:o}}).done(function(a){a.success&&(e.after(n),t.data("state",!1),$.AMUI.progress.done())}),!1)})},moveCategory2Down:function(){this.container.on("click",".movedown-category-2",function(){var t=$(this),e=$(this).parents("li"),a=e.attr("data-id"),n=e.next(),o=n.attr("data-id"),r=e.index();return r===e.parent().find("li").length-1?!1:t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-2-down",data:{currentId:a,targetId:o}}).done(function(a){a.success&&(e.before(n),t.data("state",!1),$.AMUI.progress.done())}),!1)})}}},{}],product:[function(t,e,a){"use strict";var n=window.leanAppHeader,o=t("../common/utils");e.exports={indexFun:function(){if(!function(){var t=$(".select-category-1"),e=$(".select-category-2"),a=$(".select-product-method"),n=$(".select-onsale"),r=t.val(),i=e.val(),d=a.val(),c=n.val();a.change(function(){return this.value?location.href=o.urlParamsComponent("/admin/product",{"product-method-id":this.value,onsale:c}):void(location.href=o.urlParamsComponent("/admin/product",{onsale:c}))}),t.change(function(){return this.value?location.href=o.urlParamsComponent("/admin/product",{"product-method-id":d,"category1-id":this.value,onsale:c}):void(location.href=o.urlParamsComponent("/admin/product",{"product-method-id":d,onsale:c}))}),e.change(function(){return this.value?location.href=o.urlParamsComponent("/admin/product",{"product-method-id":d,"category1-id":r,"category2-id":this.value,onsale:c}):void(location.href=o.urlParamsComponent("/admin/product",{"product-method-id":d,"category1-id":r,onsale:c}))}),n.change(function(){location.href=o.urlParamsComponent("/admin/product",{"product-method-id":d,"category1-id":r,"category2-id":i,onsale:this.value})})}(),!function(){var t=$("#modal-alert");$(".remove-product").click(function(){return $("#confirm-remove-product").modal({relatedTarget:this,onConfirm:function(){var e=this,a=$(this.relatedTarget),n=a.attr("data-id");$.ajax({type:"post",url:"/admin/product/remove/"+n}).then(function(){t.modal({relatedTarget:e,onConfirm:function(){var t=$(e.relatedTarget);t.parents("tr").detach()}}).find(".am-modal-bd").text("删除产品成功!")})},onCancel:function(){return!1}}),!1})}(),$(".am-table").on("click",".am-icon-link",function(){$(this).addClass("on")}),/product-id=\d+/.test(location.search)){var t=/product-id=(\d+)/.exec(location.search)[1],e=$("tr[data-product-id="+t+"]");e.addClass("on"),$("html,body").animate({scrollTop:e.offset().top})}!function(){var t=$("#modal-viewport"),e=t.find(".am-modal-bd");$(".link-modal-viewport").click(function(){e.append('<iframe class="iframe-viewport" src="" frameborder="0"></iframe>');var a=t.find("iframe"),n=$(this).attr("href");return a.attr("src",n),t.modal({width:800,height:520}),!1}),t.on("close.modal.amui",function(){e.empty()})}(),!function(){var t=$(".form-copy-product-content"),e=$("#modal-confirm"),a=$("#modal-alert");t.find(".am-btn").click(function(){var n=parseInt($(this).parents("tr").data("product-id"));if(""===t.serialize())return a.modal({relatedTarget:this}).find(".am-modal-bd").text("请选择需要复制的内容"),!1;var o=[];t.find("input[type=checkbox]:checked").each(function(){o.push(this.name)}),e.modal({relatedTarget:this,onConfirm:function(){var t=this;$.ajax({url:"/admin/product/product-copy",type:"post",data:{productId:n,field:o}}).then(function(e){e.success&&a.modal({relatedTarget:t,onConfirm:function(){location.reload()}}).find(".am-modal-bd").text("复制成功!")})}})})}(),!function(){var t=$("#modal-copy-etsy"),e=$(".input-copy-etsy"),a=$("#modal-loading");$(".link-copy-etsy").click(function(){var n=$(this).data("product-id");return a.find(".am-modal-hd").text("正在导入..."),console.info(n),t.modal({relatedTarget:this,onConfirm:function(t){return $.trim(e.val())&&-1!==$.trim(e.val()).indexOf("etsy.com")?($.ajax({url:"/admin/product/spider-info",data:{"product-id":n,url:$.trim(e.val())}}).then(function(t){t.code?(a.find(".am-modal-hd").text("导入成功!正在更新..."),setTimeout(function(){location.reload()},1e3)):(a.find(".am-modal-hd").text("导入失败,请重试!"),setTimeout(function(){a.modal("close")},1e3))},function(t){console.info(t),a.find(".am-modal-hd").text("导入失败,请重试!"),setTimeout(function(){a.modal("close")},1e3)}),void a.modal()):void alert("请输入正确的etsy.com链接")}}),e[0].focus(),!1})}(),$(".copy-product-title").each(function(t,e){var a=new Clipboard(e,{text:function(){return $(e).data("text")+" {"+$(e).data("id")+"}"}});a.on("success",function(t){$(e).addClass("on")})}),$(".image-source-download").click(function(){var t=$(this).next(),e=t.find(".image-source-value").val().split("\n");$(this).data("product-id");e.length&&($.each(e,function(e,a){t.append('<a href="'+a+'" download>download</a>')}),t.find("a").each(function(){var t=document.createEvent("MouseEvents");t.initEvent("click",!0,!1),this.dispatchEvent(t)}))})},addFun:function(){this.setCategory(),this.chooseBanner("add"),this.submitControl(),this.setImageList(),this.setZclip()},editFun:function(){this.setCategory(),this.chooseBanner(),this.submitControl(),this.setImageList(),this.setZclip()},setCategory:function(){var t=$(".category-group"),e=$(".btn-add-category"),a=this;t.on("change",".select-product-method",function(){var t=$(this),e=t.parents(".group"),o=e.find(".select-category-1"),r=e.find(".select-category-2");if(!this.value)return!1;if(a.isSubmitBtn)return!1;var i=parseInt(this.value);$.get({url:leanApp.api+"classes/ProductCategory1",headers:n,data:'where={"productMethodId":'+i+"}"}).done(function(t){o.find("option:not(:first)").detach(),r.find("option:not(:first)").detach();var e="";$.each(t.results,function(t,a){e+='<option value="'+a.category1Id+'">'+a.name+"</option>"}),o.append(e)})}),t.on("change",".select-category-1",function(){var t=$(this).parents(".group"),e=t.find(".select-category-2");if(!this.value)return!1;if(a.isSubmitBtn)return!1;var o=parseInt(this.value);$.get({url:leanApp.api+"classes/ProductCategory2",headers:n,data:'where={"category1Id":'+o+"}"}).done(function(t){e.find("option:not(:first)").detach();var a="";$.each(t.results,function(t,e){a+='<option value="'+e.category2Id+'">'+e.name+"</option>"}),e.append(a)})}),t.on("click",".btn-remove-category",function(){$(this).parents(".group").detach()}),e.click(function(){var e=$(this).parents(".group"),a=e.clone();a.find(".am-selected").detach(),a.find("select").removeAttr("required"),a.appendTo(t),a.find(".select-category-1 option:not(:first)").detach(),a.find(".select-category-2 option:not(:first)").detach(),a.find(".btn-add-category").removeClass("btn-add-category").addClass("btn-remove-category").text("删除"),a.find("label").detach()})},chooseBanner:function(t){var e=$("#select-banner"),a=$(".banner-view"),n=$("#banner"),o=$(".select-banner-random");e.on("change",function(){var t=e.find("option:selected").attr("data-src");a.removeClass("hide"),a.html('<img width="300" src="'+t+'"/>'),n.val(t)}),o.click(function(){var t=Math.floor(Math.random()*(e.find("option").length-1));e.find("option").get(t).selected=!0,e.trigger("change")}),"add"===t&&setTimeout(function(){o.click()},1e3)},setImageList:function(){var t=this,e=$(".image-list"),a=$("#detail-image");e.on("click",".move",function(){var e=$(this).parents("li");return 0===e.index()?!1:(e.after(e.prev()),void t.updateMainImage())}),e.on("click",".remove",function(){var e=$(this).parents("li"),n=e.find("img").attr("src");n=n.replace("?imageMogr2/thumbnail/100",""),n="![]("+n+")";var o=a.val().replace(n,"");a.val($.trim(o)),e.detach(),t.updateMainImage()}),e.on("click","input[type=checkbox]",function(){t.updateMainImage()})},submitControl:function(){var t=$("#submit"),e=this;e.isSubmitBtn=!1,$("form :submit").click(function(){var t=$(this);return e.isSubmitBtn=!0,$("form").attr({action:t.data("action"),target:t.data("target")}),"submit"===this.id&&t.data("state",t[0].id),setTimeout(function(){e.isSubmitBtn=!1,"submit"===this.id&&t.data("state",!1)}.bind(this),1e3),!0}),$(".am-form").validator({submit:function(){return this.isFormValid()?void("submit"===t.data("state")&&t.attr("disabled",!0).addClass("am-disabled")):!1}})},uploadFileSuccess:function(t){var e=$(".image-list");$.each(t,function(t,a){e.append('<li data-id="'+a.id+'" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a class="img-link" href="'+a.url+'" target="_blank"><img src="'+a.url+'?imageMogr2/thumbnail/100"/></a></p><p><a class="move" href="javascript:;">前移</a> | <span class="copy"><a class="copy-url" href="javascript:;">复制</a></span> | <a class="remove" href="javascript:;">删除</a></p></div></li>')}),this.updateMainImage()},updateMainImage:function(){var t=$("#main-image"),e=$(".image-list"),a={};e.find("input[type=checkbox]").each(function(){var t=$(this).parents("li");a[t.data("id")]={url:t.find(".img-link").attr("href"),isMainImage:this.checked}}),t.val(JSON.stringify(a)),this.setZclip()},setZclip:function(){var t=$("#detail-image"),e=$(".image-list");$(".zclip").detach(),e.find(".copy-url").detach(),e.find(".copy").append('<a class="copy-url" href="javascript:;">复制</a>'),e.find(".copy-url").each(function(){var a=this,n=$(this),o=new Clipboard(this,{text:function(){return"![]("+n.parents("li").find(".img-link").attr("href")+")"}});o.on("success",function(n){e.find(".oncopy").removeClass("oncopy"),$(a).addClass("oncopy");var o=t.val();$.trim(o)?t.val(o+"\n"+n.text):t.val(o+n.text)})})}}},{"../common/utils":4}],"product-brand":[function(t,e,a){"use strict";window.leanAppHeader;e.exports={indexFun:function(){var t=$(".remove-product-brand"),e=$("#confirm-remove-product-brand"),a=$("#modal-alert");a.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),t.click(function(){e.modal({relatedTarget:this,onConfirm:function(){var t=$(this.relatedTarget),n=parseInt(t.data("id"));
return t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.ajax({type:"post",url:"/admin/product-brand/remove/"+n,success:function(n){t.data("state",!1),$.AMUI.progress.done(),e.modal("close"),n.success?a.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("删除产品类型成功!"):a.modal().find(".am-modal-bd").text(n.message)}}),!1)}})})},addFun:function(){this.submitControl()},editFun:function(){this.submitControl()},submitControl:function(){var t=$("#submit");$(".am-form").validator({submit:function(){return this.isFormValid()?void t.attr("disabled",!0).addClass("am-disabled"):!1}})},brandLogoUploadSuccess:function(t){$("#brand-logo-image-view").empty().addClass("on").append('<li><a href="'+t[0].url+'"><img src="'+t[0].url+'"/></a></li>'),$("#brand-logo-image").val(t[0].url)},authorUploadSuccess:function(t){$("#author-image-view").empty().addClass("on").append('<li><a href="'+t[0].url+'"><img src="'+t[0].url+'"/></a></li>'),$("#author-image").val(t[0].url)},imageUploadSuccess:function(t){var e=$("#brand-detail"),a=e.val();a+="\n\n"+t[0].url,e.val(a)}}},{}],4:[function(t,e,a){"use strict";e.exports={urlParamsComponent:function(t,e){var a="";for(var n in e)e[n]&&(a+=n+"="+e[n]+"&");return t+"?"+a.substring(0,a.length-1)},productMainImageOutput:function(t){for(var e in t)if(t[e].isMainImage)return t[e].url}}},{}]},{},[5]);