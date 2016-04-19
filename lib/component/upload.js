'use strict';

let AV = require('leanengine');

let multiparty = require('multiparty');
let fs = require('fs');
let async = require('async');
let form = new multiparty.Form();


module.exports = function (req, callback) {

    form.parse(req, function (err, params, files) {

        let fileType = params.fileType ? params.fileType[0].split(',') : ['image/png', 'image/jpeg', 'image/gif'];
        let fileUrl = [];
        
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
                    return callback({
                        success: 0,
                        error: '错误的图片文件格式!'
                    });
                }
            });


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
                    //let url = theFile.thumbnailURL(100, 200);

                    fileUrl.push(newFile._url);
                    _callback();
                    
                });
            });
            
        },() => callback({success: 1, url:fileUrl}));
        

    });

};