'use strict';

let Bloodhound = require('bloodhound');
let utils = require('../common/utils');

module.exports = {

    initDesktop() {

        let mainList = $('.main-list');
        mainList.setInfinitescroll({
            setPathParse:(path,page)=> {
                let url = $('.navigation').find('a').attr('href');
                url = url.replace(/(page=\d+)/,'page=');
                return [url,''];
            },
            setData:data=> {
                let content = '';
                $.each(data.items,function(i,item) {
                    content += `
                        <li>
                            <div class="content">
                                <div class="main-img">
                                    <a href="/blog/${item.articleId}"><img width="260" height="260" src="${item.image}" alt="${item.name}"></a>
                                </div>
                                <div class="title">
                                    <a href="/blog/${item.articleId}">${item.name}</a>
                                </div>
                                <div class="info">
                                    <div class="left">
                
                                    </div>
                                    <div class="right">
                                        <span>人气:99</span>
                                        <span class="split"></span>
                                        <span>日期:2018/5/24</span>
                                    </div>
                                </div>
                            </div>
                        </li>
                `;

                });
                return content;
            }
        });

        $('.crumb .tags').each(function (i,n) {
            let _this = this;
            let id = $(this).data('id');
            $.ajax({
                url:`/admin/article/article-category-count/${id}`,
            }).done(function (data) {
                $(_this).find('em').text('('+ data.count + ')');
            });
        });

    },

    initDetailMobile() {
        this.articleId = $('.child-detail-content').attr('data-id');
        //获取子文章
        {
            let content = $('.child-detail-content');
            let id = content.attr('data-id');
            let html = `
                <div class="child-detail">
                    <h3>阅读所有子文章</h3>
                    <ul>
                    </ul>
                </div>
            `;
            $.ajax({
                url: `/admin/article/seed/${id}`
            }).done(function (data) {
                if(data.list.article) {
                    content.append(html);
                    $.each(data.list.article,function (i, n) {
                        content.find('ul').append(`<li><a href="/blog/${n.articleId}">${n.name}</a></li>`);
                    });
                }
            });
        }

        //点赞,分享
        this.eventsGood();
        this.eventsShare();
        this.favoriteProduct();
    },

    favoriteProduct() {

        let favorite = $('#favorite');
        let favoriteText = $('.favorite-text');
        let favoriteCount = $('.favorite-count');

        favorite.click(function () {

            if (!window.isLogin) {
                location.href = `/user/login?return=${location.pathname}`;
                return false;
            }

            let id = $(this).data('article-id');
            let count = parseInt(favoriteCount.text());

            if (this.checked) {

                $.ajax({
                    url: `/user/wish/article/add/${id}`
                }).then(data => {

                    if (data.success) {
                        favoriteText.parent().addClass('active');
                        favoriteText.text('已收藏');
                        favoriteCount.text(count + 1);
                    }

                });

            } else {

                $.ajax({
                    url: `/user/wish/article/edit/${id}`
                }).then(data => {

                    if (data.success) {
                        favoriteText.parent().removeClass('active');
                        favoriteText.text('收藏');
                        favoriteCount.text(count - 1);
                    }

                });

            }
        });

    },

    eventsGood() {
        let _this = this;
        let btnEventsGood = $('.events-good');
        btnEventsGood.click(function() {
            if($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active');
            let em = $(this).find('em');
            let count = em.text() || 0;
            if(count === 0) {
                em.text('( 1 )');
            } else {
                em.text(parseInt(count) + 1);
            }

            $.ajax({url:`/blog/statistics/approval/${_this.articleId}`});
        });

    },

    eventsShare() {
        let _this = this;
        let btnEventsShare = $('.events-share');
        btnEventsShare.click(function() {
            $(this).addClass('active');
            $('body').append('<div class="share-bg"></div>');
            $('.share-bg').click(function() {
                $(this).detach();
            });
            $.ajax({url:`/blog/statistics/share/${_this.articleId}`});
        });

    },

    searchFun() {

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

        }


        //header搜索typeahead
        {
            /*
            let searchBox = $('#search-box');
            let searchInput = searchBox.find('#search-input');

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
*/
        }
        //搜索历史记录
        {
            //$.cookie('new-homepage-guide-clicked', true, { expires:new Date(new Date().getTime() + 1000*60*60*24*30), path: '/' });
            let cookie = $.cookie('search-article-result');
            let searchInput = $('#search-input');
            let searchHistoryList = $('.search-history ul');
            let searchForm = $('.search-form');
            let array = [];

            if(cookie) {
                array = cookie.split(',');
                $.each(array,function(i,n) {
                    n = decodeURIComponent(n);
                    searchHistoryList.append(`<li><a href="/blog?keywords=${n}">${n}</a></li>`);
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
                $.cookie('search-article-result',array.join(),{expires:new Date(new Date().getTime() + 1000*60*60*24*30),path:'/'});
            });

            $('.clear-history').click(function() {
                if(!searchHistoryList.find('li').length) {
                    return false;
                }
                searchHistoryList.find('li').detach();
                $.cookie('search-article-result','',{expires:new Date(new Date().getTime()),path:'/'});
            });

        }

    }

};