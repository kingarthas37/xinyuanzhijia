'use strict';

let AV = require('leanengine');

let multiparty = require('multiparty');
let fs = require('fs');
let async = require('async');


module.exports = function (req, callback) {

    let form = new multiparty.Form();
    form.parse(req, function (err, params, files) {
        
        let fileType = params.fileType ? params.fileType[0].split(',') : ['image/png', 'image/jpeg', 'image/gif'];
        let fileArr = [];
        
        async.forEach(files.file, function (file, _callback) {

            if (file.size === 0) {
                return callback({
                    success: 0,
                    error: '请选择文件!'
                });
            }

            let fileValid = false;
            fileType.forEach(function (n, i) {
                if (fileValid) {
                    return false;
                }
                if (n === file.headers['content-type']) {
                    fileValid = true;
                    return false;
                }
                if (i === (fileType.length - 1)) {
                    callback({
                        success: 0,
                        error: '错误的文件格式!'
                    });
                }
            });
            
            if(!fileValid) {
                return false;
            }

            fs.readFile(file.path, function (err, data) {

                if (err) {
                    return callback({
                        success: 0,
                        error: '读取文件失败!'
                    });
                }

                let base64Data = data.toString('base64');
                let theFile = new AV.File(file.originalFilename, {base64: base64Data});
                theFile.save().then(function (newFile) {

                    console.info(newFile);
                    console.info(newFile.url);
                    console.info(newFile.attributes);
                    
                    fileArr.push({
                        url:newFile.attributes.url,
                        id:newFile.id
                    });
                    _callback();

                });
            });
            
        },() => {
            callback({
                success: 1, 
                data:fileArr
            })
        });
        

    });

};