'use strict';

var AMUI = require('amazeui');


{
    Array.prototype.unique = function(){
        var res = [];
        var json = {};
        for(var i = 0; i < this.length; i++){
            if(!json[this[i]]){
                res.push(this[i]);
                json[this[i]] = 1;
            }
        }
        return res;
    };

    Array.prototype.remove = function(obj){
        for(var i =0;i <this.length;i++){
            var temp = this[i];
            if(!isNaN(obj)){
                temp=i;
            }
            if(temp == obj){
                for(var j = i;j <this.length;j++){
                    this[j]=this[j+1];
                }
                this.length = this.length-1;
            }
        }
    };
}

$(function () {
    
    window.WIN_WIDTH = $(window).width();
    window.WIN_HEIGHT = $(window).height();
    
    //lean app header info
    window.leanAppHeader = {
        'x-avoscloud-application-id':window.leanApp.AppID,
        'x-avoscloud-application-key':window.leanApp.AppKey,
        'content-type':'application/json'
    };
    
    //login
    window.isLogin = !!$.cookie('login');

    //globalVar 只能在 非 node环境的文件 里用
    window.globalVar={
        gLog:require('./log'),
    }

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