'use strict';

let Bloodhound = require('bloodhound');

$(function() {

    
    //返回首页按钮
    {
        $('.go-back').click(function() {
            history.go(-1);
        });
    }
    
    //header menu 下拉
    {
        //$('header').find('.am-dropdown').dropdown();
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
        
        searchGoPanel.click(function() {
            searchBox.offCanvas('open');
        });

        searchClose.click(function() {
            searchBox.offCanvas('close');
        });

        searchBox.on('open.offcanvas.amui', function() {
            searchInput[0].focus();
        });

        searchBox.on('close.offcanvas.amui', function() {

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
        
        searchSelect.on('close.dropdown.amui', function (e) {
            
        });

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
 
        
        searchInput.typeahead(null, {
            display: function (item) {
                return item.value;
            },
            highlight: true,
            templates: {
                suggestion: function (item) {
                    return `<div><a href="/">${item.value}</a></div>`;
                }
            },
            source: new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: '/suggest',
                    prepare: function (query, settings) {
                        settings.data = {
                            name:$.trim(searchInput.val())
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
    
    //列表页infinitescroll
    {
        let mainList = $('.main-list');
        mainList.infinitescroll({
            debug: false,
            loading: {
                img:'//51wish.cn/min/images/admin/common/loading.gif',
                msgText:'加载中...',
                speed: 500
            },
            animate: false,
            itemSelector:'li',
            navSelector:'.navigation',
            nextSelector:'.navigation a',
            dataType: 'json',
            appendCallback: false,
            pathParse: function (path,page) {
                return ['/search/ajax?page=',location.search.replace('?','&')];
            }
        },  function(data,opts) {

            if(!data.items.length) {
                $('#infscr-loading').detach();
                mainList.infinitescroll('unbind');
                mainList.append('<div class="loading"></div>');
                let msg = $('<div id="infscr-loading" style="display: none;">当前选择下已加载全部内容</div>');
                mainList.find('.loading').append(msg);
                msg.fadeIn();
                setTimeout(()=> {
                    msg.fadeOut();
                },3000);
                return false;
            }

            let content = '';
            $.each(data.items,function(i,item) {
                
                let price = item.price > 0 ? parseFloat(item.price) : 0.00;
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
                
                content += `
                    <li>
                        <div class="img">
                            <a href="/detail/${item.productId}"><img src="/min/images/default/common/lazy.png" class="lazy" width="100" height="100" data-original="${image}?imageMogr2/thumbnail/200"></a>
                        </div>
                        <div class="detail">
                            <h3><a href="/detail/${item.productId}">${item.name}</a></h3>
                            <p>
                            <span class="price">¥ <strong>${price}</strong></span>
                            <span>${item.pageViews}次浏览</span>
                            </p>
                            <p>
                                ${stock} ${isRefund} ${isHandmade} ${isOnly}
                            </p>
                        </div>
                    </li>
                `;
                
            });
            
            let html = $(content);
            html.find('img.lazy').lazyload();
            mainList.append(html);
        });
        
        
    }
    
});