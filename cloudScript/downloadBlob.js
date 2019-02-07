'use strict';
const request = require('request');
const fs = require('fs');
const axios = require('axios');
const Qs = require("qs");
var AV = require('leanengine');

AV.Cloud.define('downloadBlob', function (request) {
    downloadBlob(request);
})

function downloadBlob(json) {
    var url = json.params.url;

    let httpStream = request({
        method: 'GET',
        url: url
    });


    // 保存成临时文件
    var src = '.temp';//临时文件的路径
    let writeStream = fs.createWriteStream(src);

    // 联接Readable和Writable
    httpStream.pipe(writeStream);

    let totalLength = 0;
    var contentLength;

    // 当获取到第一个HTTP请求的响应获取
    httpStream.on('response', (response) => {
        console.log('response headers is: ', response.headers);
        contentLength = response.headers['content-length'];
        // console.log(contentLength);
    });

    httpStream.on('data', (chunk) => {
        totalLength += chunk.length;
        console.log(`recevied data size: ${totalLength} KB; proccess:${(totalLength / contentLength * 100).toFixed(2)}%`);

    });

    // 下载完成
    writeStream.on('close', () => {
        console.log('download finished');
        newUploadShimo(src, 'demo');
    });


    async function newUploadShimo(src, filename) {
        var data = fs.createReadStream(src);
        var size = fs.lstatSync(src).size;

        var token = await getTokenShimo();
        const r = request.post({
            url: 'https://uploader.shimo.im/upload2',
            // header: headers,
        }, (err, httpResponse, body) => {
            if (err) {
                return console.error('upload failed:', err);
            }
            console.log(`Upload successful! Server responded with:`);
            console.log(body);

            //上传成功之后执行临时文件的删除;
            fs.unlink(src, (err) => {
                if (err) throw err;
                console.log(`已成功删除 ${src}`);
            });
        })
        const form = r.form();
        form.append('server', 'qiniu');
        form.append('type', 'attachments');
        form.append('accessToken', token);
        form.append('file', data, { filename: filename });//这个可以强制改名字

        var prevUploaded = 0;
        var duration = 1000;
        var start = new Date();

        var interval = setInterval(() => {

            var uploaded = r.req.connection._bytesDispatched;
            var chunk = KB2MB(uploaded - prevUploaded);
            var percent = (uploaded / size * 100).toFixed(0);
            var speed = chunk / (duration / 1000);
            console.log(`Uploaded: ${KB2MB(uploaded).toFixed(2)} MB; Progress: ${percent}%; Upload_Speed: ${speed.toFixed(2)} MB/s`);
            prevUploaded = uploaded;
            if (percent == 100) {
                clearInterval(interval);
                var end = new Date();
                var averageSpeed = (KB2MB(size) / ((end - start) / 1000));
                return console.log(`Average speed:  ${averageSpeed.toFixed(2)} MB/s`);
            }
        }, duration);

    }
}

function KB2MB(kb) {
    return kb / (1024 * 1024);
}
// downloadBlob();

function getTokenShimo() {
    return new Promise((resolve, reject) => {
        request.post('https://shimo.im/api/upload/token', {
            json: true,
            headers: {
                'Cookie': process.env.shimoCookie,
            }
        }, (err, httpResponse, body) => {
            if (!err) {
                var token = body.data.accessToken.toString();
                // console.log(token);
                resolve(token)
            } else {
                reject(false);
            }
        })
    })
}



require('../toolScript/identifier').run(!'vscode||local', () => {
    downloadBlob({
        params: {
            url: 'https://baobao-3d.bj.bcebos.com/16-0-205.shuimian.mp4'
        }
    })
})


