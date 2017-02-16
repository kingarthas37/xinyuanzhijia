'use strict';

$(function() {

    //返回首页按钮
    {
        $('.go-back').click(function() {
            history.go(-1);
        });
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
    
});