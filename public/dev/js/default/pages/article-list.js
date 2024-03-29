'use strict';

let utils = require('../common/utils');

module.exports = {

    init() {

        let mainList = $('.main-list');
        mainList.setInfinitescroll({
            setPathParse:(path,page)=> {
                let url = $('.navigation').find('a').attr('href');
                url = url.replace(/(page=\d+)/,'page=');
                return [url,$('#ajax-search').val()];
            },
            setData:data=> {
                let content = '';
                $.each(data.items,function(i,item) {

                    let price = item.price > 0 ? item.price +'.00' : '-';
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
                    let isStockText = item.stock > 0 ? '[现货]' : '';
                    let isShortStockText = item.isShortStock ? '[缺货]' : '';
                    let isShortStockCss = item.isShortStock ? 'class="out-stock"' : '';
                    let isWishClass = item.isWish ? 'add' : '';
                    let isWishText = item.isWish ? '已收藏': '收藏';

                    content += `
                    <li data-product-id="${item.productId}">
                        <div class="img">
                            <a href="/product/detail/${item.productId}"><img src="//image.wish698.cn/df9e62d1d9532ed9b308.png" class="lazy" width="100" height="100" data-original="${image}?imageMogr2/thumbnail/200"></a>
                        </div>
                        <div class="detail">
                            <h3>
                                <a href="/product/detail/${item.productId}" ${isShortStockCss}>
                                  ${isStockText}${isShortStockText} ${item.name}
                                </a>
                            </h3>
                            <p>
                            <span class="price">¥ <strong>${price}</strong></span>
                            <span>${item.pageViews}次浏览</span>
                            <a class="fav ${isWishClass}" href="javascript:;">${isWishText}</a>
                            </p>
                            <p>
                                ${isRefund} ${stock} ${isHandmade} ${isOnly}
                            </p>
                        </div>
                    </li>
                `;

                });
                return content;
            }
        });


        //子文章
        {
            $('.main-list li').each(function (i, n) {
                let id = $(n).attr('data-id');
                $.ajax({
                    url:`/admin/article/seed/${id}`
                }).done(function (data) {
                    if(data.list.count) {
                        $(n).find('.info-child').append(`<span>${data.list.count}篇子文章</span>`);
                    }
                });
            });

        }

    }

};