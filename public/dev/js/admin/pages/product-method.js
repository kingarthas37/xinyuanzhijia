'use strict';

let leanAppHeader = window.leanAppHeader;

module.exports = {

    indexFun: function () {


    },
    addFun: function () {
        this.submitControl();
    },
    editFun: function () {
        this.submitControl();
    },
    submitControl: function () {
        let submit = $('#submit');
        $('.am-form').validator({
            submit: function () {
                if (!this.isFormValid()) {
                    return false;
                }
                submit.attr('disabled', true).addClass('am-disabled');
            }
        });
    }
};