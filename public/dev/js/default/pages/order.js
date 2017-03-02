'use strict';

module.exports = {
    
    expressFun() {

        let modalSearch = $('#modal-search');
        let modalResult = $('#modal-result');
        
        $('.search-tracking').click(function() {
            let tracking = $(this).data('tracking');
            let express = $(this).data('express');
            
            modalSearch.modal();
            
            $.ajax({
                type:'get',
                url:`/order/express/query/${tracking}/${express}`
            }).then(data => {

                let template = '';
                if(data.list) {
                    for(let i=0;i<data.list.length;i++) {
                        let last = i === data.list.length-1 ? 'color-timeline-item-last' : '';
                        let color = i === 0 ? 'green' : 'blue';
                        template += `
                            <li class="color-timeline-item ${last}">
                                <div class="color-timeline-item-tail"></div>
                                <div class="color-timeline-item-head color-timeline-item-head-${color}"></div>
                                <div class="color-timeline-item-content"><strong>${data.list[i].time}</strong> ${data.list[i].status}</div>
                            </li>
                        `;
                    }
                } else {
                    template = `
                        <li class="color-timeline-item color-timeline-item-last">
                            <div class="color-timeline-item-tail"></div>
                            <div class="color-timeline-item-head color-timeline-item-head-red"></div>
                            <div class="color-timeline-item-content">${data.msg}</div>
                        </li>
                    `;
                }
                modalSearch.modal('close');

                modalResult.find('ul').html(template);
                modalResult.modal();
            }, error => {
                modalSearch.modal('close');
                modalResult.find('ul').html(error);
                modalResult.modal();
            });

            
            
        });
        
    }

};