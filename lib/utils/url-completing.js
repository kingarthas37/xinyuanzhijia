'use strict';

module.exports = url => {
    
    if(url.trim() === '') {
        return '';
    }

    if(url.indexOf('http') > -1) {
        return url;
    }

    return 'http://' + url;
};