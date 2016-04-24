'use strict';

require('jquery-validate');

module.exports = {

    loginFun:function() {
        this.submitControl();
    },
    
    registerFun:function() {
        this.submitControl();
    },
    
    submitControl:function() {
        let submit = $('#submit');
        $('.am-form').validator({
            submit:function() {
                if(!this.isFormValid()){
                    return false;
                }
                submit.attr('disabled',true).addClass('am-disabled');
            }
        });
    }

};