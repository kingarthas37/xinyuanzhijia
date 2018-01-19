module.exports = {
    init() {

        window.onload = function () {

            //home view js
            var $home = $('.content1'),
                screenHeight = document.documentElement.clientHeight || document.body.clientHeight || 0;
            $home.height(screenHeight);

            //menu
            var $menu = $('.menu'),
                $menuList = $menu.find('ul'),
                scrollTop = 0;

            //link direct
            var $html = $('html,body');
            var menuPosArr = [];
            var currentMenuLink = 0;

            $('div[data-target]').each(function() {
                var top = $(this).offset().top,
                    height = $(this).height();
                $(this).attr({
                    'data-top':top,
                    'data-height':height
                });
                menuPosArr.push({
                    top:top,
                    height:height + top
                });
            });

            $(window).scroll(function() {
                var top = $(this).scrollTop();
                scrollTop = top;

                $.each(menuPosArr,function(i,n) {
                    if (scrollTop >= n.top  && scrollTop <= n.height  && i !== currentMenuLink) {
                        currentMenuLink = i;
                        $menuList.find('.active').removeClass('active');
                        $menuList.find('a').eq(i+1).addClass('active');
                        return;
                    }
                });

            });

            $('.arrow').click(function () {
                $menu.find('a').eq(2).click();
            });



            $('a.link').click(function() {
                $menu.find('.active').removeClass('active');
                $(this).addClass('active');
                $html.animate({scrollTop: parseInt($('div[data-target='+ $(this).attr('data-link') +']').attr('data-top'))  });
            });

        }

    }
};