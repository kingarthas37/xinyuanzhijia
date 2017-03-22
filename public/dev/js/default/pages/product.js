'use strict';

module.exports = {

    detailFun() {

        //收藏
        this.favoriteProduct();
        
        $('.am-slider').flexslider({
            directionNav:false
        });
        
    },
    
    favoriteProduct() {
        
        let favorite = $('#favorite');
        let favoriteText = $('.favorite-text');
        let favoriteCount = $('.favorite-count');
        
        favorite.click(function() {
            
            if(!window.isLogin) {
                location.href = `/user/login?return=${location.pathname}`;
                return false;
            }
            
            let productId = $(this).data('product-id');
            let count = parseInt(favoriteCount.text());

            if(this.checked) {
                
                $.ajax({
                    url:`/user/wish/add/${productId}`
                }).then(data => {

                    if(data.success) {
                        favoriteText.parent().addClass('active');
                        favoriteText.text('已收藏');
                        favoriteCount.text(count + 1);
                    }
                    
                });
                
            } else {

                $.ajax({
                    url:`/user/wish/edit/${productId}`
                }).then(data => {

                    if(data.success) {
                        favoriteText.parent().removeClass('active');
                        favoriteText.text('收藏');
                        favoriteCount.text(count - 1);
                    }

                });
                
            }
        });
        
    }

};