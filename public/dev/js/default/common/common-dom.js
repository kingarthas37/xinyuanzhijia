'use strict';

let Bloodhound = require('bloodhound');

$(function() {

    
    //返回首页按钮
    {
        $('.go-back').click(function() {
            history.go(-1);
        });
    } 
    
    //图片懒加载
    {
        $('img.lazy').lazyload();
    }
    
    //搜索面板
    {
        let searchGoPanel = $('.search-go-panel');
        let searchBox = $('#search-box');
        let searchClose = $('.search-close').find('a');
        let searchInput = $('#search-input');
        let searchSelect = $('.search-select');
    
        searchSelect.dropdown();
        
        searchGoPanel.click(function() {
            searchBox.offCanvas('open');
        });

        searchClose.click(function() {
            searchBox.offCanvas('close');
        });

        searchBox.on('open.offcanvas.amui', function() {
            searchInput[0].focus();
        });
        
    }
    
    //am-alert
    {
        let amAlert= $('.am-alert');
        if(amAlert.length) {
            amAlert.fadeIn();
            setTimeout(()=> amAlert.fadeOut(),2000);
        }
    }
    
    //搜索面板选择搜索主题 
    {
        let searchInput = $('#search-input');
        let searchSelect = $('.search-select');
        let searchSelectContent = searchSelect.find('.am-dropdown-content');
        let selectButton = searchSelect.find('.am-btn');

        searchSelectContent.find('a').click(function() {
            searchSelectContent.find('.am-active').removeClass('am-active');
            $(this).parent().addClass('am-active');
            searchSelect.dropdown('close');
            selectButton.find('em').text($(this).text());
            searchInput.attr('placeholder','搜索'+$(this).text());
            searchInput[0].focus();
        });
    }
    
    //header搜索typeahead
    {
        let searchBox = $('#search-box');
        let search = searchBox.find('.search');
        let searchInput = searchBox.find('#search-input');
       
        let productMethodId = (()=> {
            if(/method=\d+/.test(location.search)) {
                return /method=(\d+)/.exec(location.search)[1];
            } else {
                return 3;
            }
        })();
        $('#search-product-method').val(productMethodId);
        
        searchInput.typeahead(null, {
            limit:10,
            display: function (item) {
                return item.value;
            },
            highlight: true,
            templates: {
                suggestion: function (item) {
                    return `<div><a href="/product/detail/${item.productId}">${item.value}</a></div>`;
                }
            },
            source: new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/suggest',
                    prepare: function (query, settings) {
                        settings.data = {
                            name:$.trim(searchInput.val()),
                            productMethodId
                        };
                        return settings;
                    }
                }
            })
        });

        searchBox.find('.tt-menu').css({
            width:WIN_WIDTH
        });
        
    }
    
    //搜索历史记录
    {
        //$.cookie('new-homepage-guide-clicked', true, { expires:new Date(new Date().getTime() + 1000*60*60*24*30), path: '/' });
        let cookie = $.cookie('search-result');
        let searchInput = $('#search-input');
        let searchHistoryList = $('.search-history ul');
        let searchForm = $('.search-form');
        let searchProductMethod = $('#search-product-method');
        let array = [];
        
        if(cookie) {
            array = cookie.split(',');
            $.each(array,function(i,n) {
                n = decodeURIComponent(n);
                searchHistoryList.append(`<li><a href="/search?method=${searchProductMethod.val()}&keywords=${n}">${n}</a></li>`);
            });
        } else {
            searchHistoryList.append('<li><a class="color-gray" href="javascript:;">无搜索记录</a></li>');
        }
        
        searchForm.submit(function() {
            let value = $.trim(searchInput.val());
            array.unshift(value);
            array = array.unique();
            if(array.length> 5) {
                array.length = 5;
            }
            $.cookie('search-result',array.join(),{expires:new Date(new Date().getTime() + 1000*60*60*24*30),path:'/'});
        });
        
        $('.clear-history').click(function() {
            if(!searchHistoryList.find('li').length) {
                return false;
            }
            searchHistoryList.find('li').detach();
            $.cookie('search-result','',{expires:new Date(new Date().getTime()),path:'/'});
        });
        
    }
    
    
    //$.fn产品列表页infinitescroll
    {
        $.fn.setInfinitescroll = function(opts) {

            let container = $(this);
            
            let settings = $.extend({
                navSelector:'.navigation',
                nextSelector:'.navigation a',
                setPathParse:()=> {},
                setData:()=> {}
            },opts || {});
            
            container.infinitescroll({
                debug: false,
                loading: {
                    img:'//ac-JoaBcRTt.clouddn.com/8ded071cdd14788c50fa.gif',
                    msgText:'加载中...',
                    speed: 500
                },
                animate: false,
                itemSelector:'li',
                navSelector:settings.navSelector,
                nextSelector:settings.nextSelector,
                dataType: 'json',
                appendCallback: false,
                pathParse: function (path,page) {
                    return settings.setPathParse(path,page);
                }
            },  function(data,opts) {

                if(!data.items.length) {
                    $('#infscr-loading').detach();
                    container.infinitescroll('unbind');
                    container.append('<div class="loading"></div>');
                    let msg = $('<div id="infscr-loading" style="display:none;">当前选择下已加载全部内容</div>');
                    container.find('.loading').append(msg);
                    msg.fadeIn();
                    setTimeout(()=> {
                        msg.fadeOut();
                    },3000);
                    return false;
                }

                let html = $(settings.setData(data));
                html.find('img.lazy').lazyload();
                container.append(html);
            });
            
            return container;
        };
        
    }
    
});