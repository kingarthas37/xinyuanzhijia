'use strict';

var AMUI = require('amazeui');

$(function () {
    
    //lean app header info
    window.leanAppHeader = {
        'x-avoscloud-application-id':window.leanApp.AppID,
        'x-avoscloud-application-key':window.leanApp.AppKey,
        'content-type':'application/json'
    };
    
    // Avoid `console` errors in browsers that lack a console.
    {
        var method;
        var noop = function () {
        };
        var methods = [
            'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
            'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
            'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
            'timeStamp', 'trace', 'warn'
        ];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];
            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }

    //jquery validate
    {
        jQuery.validator.addMethod("isMobile", function(value, element) {
            var length = value.length;
            var mobile = /^1[0-9]{10}$/;
            return this.optional(element) || (length == 11 && mobile.test(value));
        }, "请正确填写您的手机号码");
    }

});