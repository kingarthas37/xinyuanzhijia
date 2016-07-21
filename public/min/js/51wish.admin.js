require=function e(n,o,t){function r(a,c){if(!o[a]){if(!n[a]){var u="function"==typeof require&&require;if(!c&&u)return u(a,!0);if(i)return i(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var s=o[a]={exports:{}};n[a][0].call(s.exports,function(e){var o=n[a][1][e];return r(o?o:e)},s,s.exports,e,n,o,t)}return o[a].exports}for(var i="function"==typeof require&&require,a=0;a<t.length;a++)r(t[a]);return r}({3:[function(e,n,o){"use strict";e("../../../../js/main"),e("./config"),e("./common")},{"../../../../js/main":14,"./common":1,"./config":2}],2:[function(e,n,o){"use strict";var t="51wish";window.env=function(){return location.hostname===t+".leanapp.cn"||location.hostname===t+".cn"||location.host==="www."+t+".cn"?"production":location.hostname==="stg-"+t+".leanapp.cn"?"stage":"development"};var r=function(){return"production"===env()?"//51wish.cn/1.1/functions/":"stage"===env()?"//stg-51wish.leanapp.cn/1.1/functions/":"/1.1/functions/"};window.leanApp={appdId:"QuiPuWpJPzCahsgBK7teBOJN-gzGzoHsz",api:"https://leancloud.cn/1.1/",cloud:r()},window.leanAppHeader={"x-lc-id":leanApp.appdId,"x-lc-sign":$.cookie("x_lc_sign")||"","x-lc-session":$.cookie("x_lc_session")||"","x-lc-prod":"production"===env()?1:0,"content-type":"application/json"}},{}],1:[function(e,n,o){"use strict";var t=e("amazeui");$(function(){for(var e,n=function(){},o=["assert","clear","count","debug","dir","dirxml","error","exception","group","groupCollapsed","groupEnd","info","log","markTimeline","profile","profileEnd","table","time","timeEnd","timeStamp","trace","warn"],r=o.length,i=window.console=window.console||{};r--;)e=o[r],i[e]||(i[e]=n);$.extend($.validator.messages,{required:"必选字段",remote:"请修正该字段",email:"请输入正确格式的电子邮件",url:"请输入合法的网址",date:"请输入合法的日期",dateISO:"请输入合法的日期 (ISO).",number:"请输入合法的数字",digits:"只能输入整数",creditcard:"请输入合法的信用卡号",equalTo:"请再次输入相同的值",accept:"请输入拥有合法后缀名的字符串",maxlength:jQuery.validator.format("请输入一个 长度最多是 {0} 的字符串"),minlength:jQuery.validator.format("请输入一个 长度最少是 {0} 的字符串"),rangelength:jQuery.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),range:jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),max:jQuery.validator.format("请输入一个最大为{0} 的值"),min:jQuery.validator.format("请输入一个最小为{0} 的值")}),t.plugin("amuiSelected",t.selected),$("[data-am-selected]").amuiSelected()})},{amazeui:7}]},{},[3]);
require=function t(a,e,o){function r(i,d){if(!e[i]){if(!a[i]){var s="function"==typeof require&&require;if(!d&&s)return s(i,!0);if(n)return n(i,!0);var c=new Error("Cannot find module '"+i+"'");throw c.code="MODULE_NOT_FOUND",c}var u=e[i]={exports:{}};a[i][0].call(u.exports,function(t){var e=a[i][1][t];return r(e?e:t)},u,u.exports,t,a,e,o)}return e[i].exports}for(var n="function"==typeof require&&require,i=0;i<o.length;i++)r(o[i]);return r}({4:[function(t,a,e){"use strict";t("../../../../js/main"),t("./product"),t("./product-category"),t("./product-method"),t("./product-preview"),t("./product-property"),t("./product-brand"),t("./upload"),t("./sign")},{"../../../../js/main":14,"./product":"product","./product-brand":"product-brand","./product-category":"product-category","./product-method":"product-method","./product-preview":"product-preview","./product-property":"product-property","./sign":"sign","./upload":"upload"}],upload:[function(t,a,e){"use strict";a.exports={uploadFile:function(t){var a=$("#form-upload"),e=$("#file"),o=$(".upload-loading"),r=$(".am-btn"),n=$(".text"),i=t.fileType,d=t.callbackName;a.submit(function(){return o.addClass("on"),r.removeClass("am-btn-primary").addClass("am-btn-default").prop("disabled",!0),n.text("正在上传..."),e.hide(),$(this).ajaxSubmit({data:{fileType:i},success:function(t){e.val(""),o.removeClass("on"),r.addClass("am-btn-primary").removeClass("am-btn-default").prop("disabled",!1),n.text("选择要上传的文件"),e.show(),t.success?window.parent[d](t.data):alert(t.error)}}),!1}),e.change(function(){this.value&&a.submit()})}}},{}],sign:[function(t,a,e){"use strict";t("jquery-validate"),a.exports={loginFun:function(){this.submitControl()},registerFun:function(){this.submitControl()},submitControl:function(){var t=$("#submit");$(".am-form").validator({submit:function(){return this.isFormValid()?void t.attr("disabled",!0).addClass("am-disabled"):!1}})}}},{"jquery-validate":13}],"product-property":[function(t,a,e){"use strict";window.leanAppHeader;a.exports={init:function(){this.setContentDisplay(),this.setPurchaseLinkContent(),this.setShopLinkContent()},setContentDisplay:function(){if(location.hash){var t=$("#accordion-"+location.hash.substring(1));t.length&&(t.addClass("am-active"),t.find(".am-collapse").addClass("am-in"))}},setPurchaseLinkContent:function(){"#purchase-link"===location.hash&&setTimeout(function(){return $("input[name=purchase-link]").get(0).focus()},0)},setShopLinkContent:function(){"#shop-link"===location.hash&&setTimeout(function(){return $("input[name=shop-link]").get(0).focus()},0)}}},{}],"product-preview":[function(t,a,e){"use strict";a.exports=function(){var t=$(".preview-content"),a=$.trim(t.html()),e=$(".btn-copy");e.zclip({path:"/assets/swf/ZeroClipboard.swf",copy:function(){return a},afterCopy:function(){e.popover({content:"复制成功!"})}});var o=$(".btn-shot");o.button("loading");var r=$.AMUI.progress;window.onload=function(){o.button("reset"),o.click(function(){r.start(),o.button("loading").text("图片生成中..."),$.ajax({url:"/admin/product/preview/shot",type:"post",data:{html:a,htmlHeight:t.height(),name:$("h4").text()},success:function(){r.done(),$("#modal-shot-success").modal(),o.button("reset").text("生成淘宝详情图片")}})})}}},{}],"product-method":[function(t,a,e){"use strict";window.leanAppHeader;a.exports={indexFun:function(){var t=$(".remove-product-method"),a=$("#confirm-remove-product-method"),e=$("#modal-alert");e.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),t.click(function(){a.modal({relatedTarget:this,onConfirm:function(){var t=$(this.relatedTarget),o=parseInt(t.data("id"));return t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.ajax({type:"post",url:"/admin/product-method/remove/"+o,success:function(o){t.data("state",!1),$.AMUI.progress.done(),a.modal("close"),o.success?e.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("删除产品类型成功!"):e.modal().find(".am-modal-bd").text(o.message)}}),!1)}})})},addFun:function(){this.submitControl()},editFun:function(){this.submitControl()},submitControl:function(){var t=$("#submit");$(".am-form").validator({submit:function(){return this.isFormValid()?void t.attr("disabled",!0).addClass("am-disabled"):!1}})}}},{}],"product-category":[function(t,a,e){"use strict";a.exports={indexFun:function(){this.container=$(".am-accordion"),this.selectProductMethod(),this.addCategory1(),this.editCategory1(),this.removeCategory1(),this.moveCategory1Up(),this.moveCategory1Down(),this.addCategory2(),this.editCategory2(),this.removeCategory2(),this.moveCategory2Up(),this.moveCategory2Down()},selectProductMethod:function(){var t=$(".select-product-method");this.productMethodId=t.val()?parseInt(t.val()):0,t.change(function(){location.href="/admin/product-category?product-method-id="+this.value})},addCategory1:function(){var t=$("#modal-category-1-add"),a=$("#input-category-1-add"),e=$("#modal-category-1-confirm-add"),o=this.productMethodId;$(".btn-category-1-add").click(function(){a.val(""),t.modal({relatedTarget:this})}),e.click(function(){return e.data("state")?!1:($.AMUI.progress.start(),e.data("state",!0),$.post({url:leanApp.api+"classes/ProductCategory1",headers:leanAppHeader,data:JSON.stringify({index:$(".am-accordion-item").length,name:$.trim(a.val())?$.trim(a.val()):"无分类名",productMethodId:o}),success:function(){$.AMUI.progress.done(),e.data("state",!1),t.modal("close"),location.reload()}}),!1)})},editCategory1:function(){var t=$("#modal-category-1-edit"),a=$("#input-category-1-edit"),e=$("#modal-category-1-confirm-edit"),o=$("#modal-alert"),r=this.productMethodId,n=null;$(".edit-category-1").each(function(){$(this).click(function(){var e=$(this).parents(".am-accordion-title").find("strong").text();return a.val($.trim(e)),t.modal({relatedTarget:this}),n=$(this).parents(".am-accordion-item").attr("data-id"),!1})}),e.click(function(){return e.data("state")?!1:($.AMUI.progress.start(),e.data("state",!0),$.get({url:leanApp.api+"classes/ProductCategory1",headers:leanAppHeader,data:'where={"category1Id":'+n+"}"}).done(function(t){return $.ajax({type:"PUT",url:leanApp.api+"classes/ProductCategory1/"+t.results[0].objectId,headers:leanAppHeader,data:JSON.stringify({name:$.trim(a.val()),productMethodId:r})})}).done(function(){e.data("state",!1),$.AMUI.progress.done(),t.modal("close"),o.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("编辑一级分类成功!")}),!1)})},removeCategory1:function(){var t=$(".remove-category-1"),a=$("#modal-category-1-remove"),e=$("#modal-alert");e.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),t.each(function(t,o){$(o).click(function(){$(this);return a.modal({relatedTarget:this,onConfirm:function(){var t=$(this.relatedTarget);return t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/remove-category-1",data:{id:t.parents(".am-accordion-item").attr("data-id")},success:function(o){t.data("state",!1),$.AMUI.progress.done(),a.modal("close"),o.success?e.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("删除一级分类成功!"):e.modal().find(".am-modal-bd").text(o.message)}}),!1)}}),!1})})},moveCategory1Up:function(){$(".moveup-category-1").each(function(){$(this).click(function(){var t=$(this),a=t.parents(".am-accordion-item"),e=a.prev(),o=a.attr("data-id"),r=e.attr("data-id"),n=a.index();return 0===n?!1:t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-1-up",data:{currentId:o,targetId:r}}).done(function(o){o.success&&(a.after(e),t.data("state",!1),$.AMUI.progress.done())}),!1)})})},moveCategory1Down:function(){var t=$(".am-accordion-item");$(".movedown-category-1").each(function(){$(this).click(function(){var a=$(this),e=a.parents(".am-accordion-item"),o=e.next(),r=e.attr("data-id"),n=o.attr("data-id"),i=e.index();return i===t.length-1?!1:a.data("state")?!1:(a.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-1-down",data:{currentId:r,targetId:n}}).done(function(t){t.success&&(e.before(o),a.data("state",!1),$.AMUI.progress.done())}),!1)})})},addCategory2:function(){var t=$("#modal-category-2-add"),a=$("#input-category-2-add"),e=$("#modal-category-2-confirm-add"),o=null,r=null;$(".btn-category-2-add").each(function(e,n){$(n).click(function(){o=$(this).parents(".am-accordion-item"),r=parseInt(o.attr("data-id")),a.val(""),t.modal({relatedTarget:this})})}),e.click(function(){if(e.data("state"))return!1;$.AMUI.progress.start(),e.data("state",!0);var n=o.find(".category-2-list li").length;return $.post({url:"/admin/product-category/add-category-2",data:{index:n,name:$.trim(a.val())?$.trim(a.val()):"无标题",category1Id:r}}).done(function(a){$.AMUI.progress.done(),e.data("state",!1),t.modal("close"),o.find(".category-2-list").append('\n                        <li data-id="'+a.id+'">\n                            <strong>'+a.name+'</strong>\n                            <span class="options">\n                                <a class="edit-category-2" href="javascript:;">编辑</a>\n                                <a class="moveup-category-2" href="javascript:;">上移</a>\n                                <a class="movedown-category-2" href="javascript:;">下移</a>\n                                <a class="remove-category-2" href="javascript:;">删除</a>\n                            </span>\n                        </li>\n                ')}),!1})},editCategory2:function(){var t=$("#modal-category-2-edit"),a=$("#input-category-2-edit"),e=$("#modal-category-2-confirm-edit"),o=$("#modal-alert"),r=null,n=null;this.container.on("click",".edit-category-2",function(){return r=$(this).parents("li"),a.val($.trim(r.find("strong").text())),n=r.attr("data-id"),t.modal({relatedTarget:this}),!1}),e.click(function(){return e.data("state")?!1:($.AMUI.progress.start(),e.data("state",!0),$.get({url:leanApp.api+"classes/ProductCategory2",headers:leanAppHeader,data:'where={"category2Id":'+n+"}"}).done(function(t){return $.ajax({type:"PUT",url:leanApp.api+"classes/ProductCategory2/"+t.results[0].objectId,headers:leanAppHeader,data:JSON.stringify({name:$.trim(a.val())})})}).done(function(){e.data("state",!1),$.AMUI.progress.done(),t.modal("close"),o.modal({onConfirm:function(){return r.find("strong").text(a.val())}}).find(".am-modal-bd").text("编辑二级分类成功!")}),!1)})},removeCategory2:function(){var t=$("#modal-category-2-remove"),a=$("#modal-alert");a.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),this.container.on("click",".remove-category-2",function(){return t.modal({relatedTarget:this,onConfirm:function(){var e=$(this.relatedTarget),o=e.parents("li");return e.data("state")?!1:(e.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/remove-category-2",data:{category1Id:o.parents(".am-accordion-item").attr("data-id"),category2Id:o.attr("data-id")},success:function(r){e.data("state",!1),$.AMUI.progress.done(),t.modal("close"),r.success?a.modal({onConfirm:function(){return o.detach()}}).find(".am-modal-bd").text("删除二级分类成功!"):a.modal().find(".am-modal-bd").text(r.message)}}),!1)}}),!1})},moveCategory2Up:function(){this.container.on("click",".moveup-category-2",function(){var t=$(this),a=$(this).parents("li"),e=a.attr("data-id"),o=a.prev(),r=o.attr("data-id"),n=a.index();return 0===n?!1:t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-2-up",data:{currentId:e,targetId:r}}).done(function(e){e.success&&(a.after(o),t.data("state",!1),$.AMUI.progress.done())}),!1)})},moveCategory2Down:function(){this.container.on("click",".movedown-category-2",function(){var t=$(this),a=$(this).parents("li"),e=a.attr("data-id"),o=a.next(),r=o.attr("data-id"),n=a.index();return n===a.parent().find("li").length-1?!1:t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.get({url:"/admin/product-category/move-category-2-down",data:{currentId:e,targetId:r}}).done(function(e){e.success&&(a.before(o),t.data("state",!1),$.AMUI.progress.done())}),!1)})}}},{}],"product-brand":[function(t,a,e){"use strict";window.leanAppHeader;a.exports={indexFun:function(){var t=$(".remove-product-brand"),a=$("#confirm-remove-product-brand"),e=$("#modal-alert");e.on("closed.modal.amui",function(){$(this).removeData("amui.modal")}),t.click(function(){a.modal({relatedTarget:this,onConfirm:function(){var t=$(this.relatedTarget),o=parseInt(t.data("id"));return t.data("state")?!1:(t.data("state",!0),$.AMUI.progress.start(),$.ajax({type:"post",url:"/admin/product-brand/remove/"+o,success:function(o){t.data("state",!1),$.AMUI.progress.done(),a.modal("close"),o.success?e.modal({onConfirm:function(){return location.reload()}}).find(".am-modal-bd").text("删除产品类型成功!"):e.modal().find(".am-modal-bd").text(o.message)}}),!1)}})})},addFun:function(){this.submitControl()},editFun:function(){this.submitControl()},submitControl:function(){var t=$("#submit");$(".am-form").validator({submit:function(){return this.isFormValid()?void t.attr("disabled",!0).addClass("am-disabled"):!1}})},brandLogoUploadSuccess:function(t){$("#brand-logo-image-view").empty().addClass("on").append('<li><a href="'+t[0].url+'"><img src="'+t[0].url+'"/></a></li>'),$("#brand-logo-image").val(t[0].url)},authorUploadSuccess:function(t){$("#author-image-view").empty().addClass("on").append('<li><a href="'+t[0].url+'"><img src="'+t[0].url+'"/></a></li>'),$("#author-image").val(t[0].url)}}},{}],product:[function(t,a,e){"use strict";var o=window.leanAppHeader,r=(t("swfobject"),t("flash-detect")),n=t("./product/list-data-request");a.exports={indexFun:function(){var t=$(".select-category-1"),a=$(".select-category-2"),e=$(".select-product-method"),o=$("#modal-alert");e.change(function(){return this.value?location.href="/admin/product?product-method-id="+this.value:void(location.href="/admin/product")}),t.change(function(){var t=e.val();return this.value?location.href="/admin/product?product-method-id="+t+"&category1-id="+this.value:void(location.href="/admin/product?product-method-id="+t)}),a.change(function(){var a=e.val(),o=t.val();return this.value?location.href="/admin/product?product-method-id="+a+"&category1-id="+o+"&category2-id="+this.value:void(location.href="/admin/product?product-method-id="+a+"&category1-id="+o)}),$(".remove-product").click(function(){return $("#confirm-remove-product").modal({relatedTarget:this,onConfirm:function(){var t=this,a=$(this.relatedTarget),e=a.attr("data-id");$.ajax({type:"post",url:"/admin/product/remove/"+e}).then(function(){o.modal({relatedTarget:t,onConfirm:function(){var a=$(t.relatedTarget);a.parents("tr").detach()}}).find(".am-modal-bd").text("删除产品成功!")})},onCancel:function(){return!1}}),!1}),n.init(),$(".am-table").on("click",".am-icon-link",function(){$(this).addClass("on")})},addFun:function(){this.setCategory(),this.chooseBanner(),this.submitControl(),this.setImageList(),this.setZclip()},editFun:function(){this.setCategory(),this.chooseBanner(),this.submitControl(),this.setImageList(),this.setZclip()},setCategory:function(){var t=$(".category-group"),a=$(".btn-add-category"),e=this;t.on("change",".select-product-method",function(){var t=$(this),a=t.parents(".group"),r=a.find(".select-category-1"),n=a.find(".select-category-2");if(!this.value)return!1;if(e.isSubmitBtn)return!1;var i=parseInt(this.value);$.get({url:leanApp.api+"classes/ProductCategory1",headers:o,data:'where={"productMethodId":'+i+"}"}).done(function(t){r.find("option:not(:first)").detach(),n.find("option:not(:first)").detach();var a="";$.each(t.results,function(t,e){a+='<option value="'+e.category1Id+'">'+e.name+"</option>"}),r.append(a)})}),t.on("change",".select-category-1",function(){var t=$(this).parents(".group"),a=t.find(".select-category-2");if(!this.value)return!1;if(e.isSubmitBtn)return!1;var r=parseInt(this.value);$.get({url:leanApp.api+"classes/ProductCategory2",headers:o,data:'where={"category1Id":'+r+"}"}).done(function(t){a.find("option:not(:first)").detach();var e="";$.each(t.results,function(t,a){e+='<option value="'+a.category2Id+'">'+a.name+"</option>"}),a.append(e)})}),t.on("click",".btn-remove-category",function(){$(this).parents(".group").detach()}),a.click(function(){var a=$(this).parents(".group"),e=a.clone();e.find(".am-selected").detach(),e.find("select").removeAttr("data-am-selected").removeAttr("required"),e.appendTo(t),e.find(".select-category-1 option:not(:first)").detach(),e.find(".select-category-2 option:not(:first)").detach(),e.find(".btn-add-category").removeClass("btn-add-category").addClass("btn-remove-category").text("删除"),e.find("label").detach(),e.find("select").amuiSelected()})},chooseBanner:function(){var t=$("#select-banner"),a=$(".banner-view"),e=$("#banner");t.on("change",function(){var o=t.find("option:selected").attr("data-src");a.removeClass("hide"),a.html('<img width="400" src="'+o+'"/>'),e.val(o)}),$(".select-banner-random").click(function(){var a=Math.floor(Math.random()*(t.find("option").length-1))+1;console.info(a),t.find("option").eq(a).attr("selected",!0)})},setImageList:function(){var t=this,a=$(".image-list");a.on("click",".move",function(){var a=$(this).parents("li");return 0===a.index()?!1:(a.after(a.prev()),void t.updateMainImage())}),a.on("click",".remove",function(){var a=$(this).parents("li");$.ajax({type:"DELETE",url:leanApp.api+"files/"+a.data("id"),headers:o}).done(function(){a.detach(),t.updateMainImage()})}),a.on("click","input[type=checkbox]",function(){t.updateMainImage()})},submitControl:function(){var t=$("#submit"),a=this;a.isSubmitBtn=!1,$("form :submit").click(function(){var t=$(this);return a.isSubmitBtn=!0,$("form").attr({action:t.data("action"),target:t.data("target")}),"submit"===this.id&&t.data("state",t[0].id),setTimeout(function(){a.isSubmitBtn=!1,"submit"===this.id&&t.data("state",!1)}.bind(this),1e3),!0}),$(".am-form").validator({submit:function(){return this.isFormValid()?void("submit"===t.data("state")&&t.attr("disabled",!0).addClass("am-disabled")):!1}})},uploadFileSuccess:function(t){var a=$(".image-list");$.each(t,function(t,e){a.append('<li data-id="'+e.id+'" class="am-cf"><div class="am-fl"><input type="checkbox" /></div><div class="am-fr"><p><a class="img-link" href="'+e.url+'" target="_blank"><img src="'+e.url+'?imageMogr2/thumbnail/100"/></a></p><p><a class="move" href="javascript:;">前移</a> | <span class="copy"><a class="copy-url" href="javascript:;">复制</a></span> | <a class="remove" href="javascript:;">删除</a></p></div></li>')}),this.updateMainImage()},updateMainImage:function(){var t=$("#main-image"),a=$(".image-list"),e={};a.find("input[type=checkbox]").each(function(){var t=$(this).parents("li");e[t.data("id")]={url:t.find(".img-link").attr("href"),isMainImage:this.checked}}),t.val(JSON.stringify(e)),this.setZclip()},setZclip:function(){r.installed&&!function(){var t=$(".image-list");$(".zclip").detach(),t.find(".copy-url").detach(),t.find(".copy").append('<a class="copy-url" href="javascript:;">复制</a>'),t.find(".copy-url").each(function(){$(this).zclip({path:"/assets/swf/ZeroClipboard.swf",copy:function(){return"![]("+$(this).parents("li").find(".img-link").attr("href")+")"},afterCopy:function(){t.find(".oncopy").removeClass("oncopy"),$(this).addClass("oncopy")}})})}()}}},{"./product/list-data-request":5,"flash-detect":8,swfobject:15}],5:[function(t,a,e){"use strict";a.exports={init:function(){var t=[];$(".am-table").find("tr[data-product-id]").each(function(a,e){t.push($(e).data("product-id"))}),$("span[data-product-id]").length&&$.ajax({url:"/admin/product/list-data",data:{productListId:t}}).then(function(t){return t.success?void(t.products.length&&$.each(t.products,function(t,a){var e=$(".purchase-link[data-product-id="+a.productId+"]"),o=$(".shop-link[data-product-id="+a.productId+"]"),r="",n="";$.each(a.purchaseLink,function(t,a){a&&(r+="<a href="+a+' target="_blank"><i class="am-icon-link"></i></a> ')}),r?e.html(r):e.html('<a href="/admin/product-property/'+a.productId+'#purchase-link">-</a>'),$.each(a.shopLink,function(t,a){a&&(n+="<a href="+a+' target="_blank"><i class="am-icon-link"></i></a> ')}),n?o.html(n):o.html('<a href="/admin/product-property/'+a.productId+'#shop-link">-</a>')})):!1})}}},{}]},{},[4]);