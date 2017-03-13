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
    /*
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
    */
    
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
    
    
    
});