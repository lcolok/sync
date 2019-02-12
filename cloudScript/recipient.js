'use strict';
const request = require('request');
const AV = require('leanengine');
const stream = require('stream');


AV.Cloud.define('recipient', function (request) {
    recipient(request);
})



async function recipient(input) {
    console.log(input);

    return
    var data = input.params.data;
    var size = input.params.size;
    var filename = input.params.filename ? input.params.filename : data.path.split('/').pop();
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
        if ((percent >= 100)||(percent == 0)) {
            clearInterval(interval);
            var end = new Date();
            var averageSpeed = (KB2MB(size) / ((end - start) / 1000));
            return console.log(`Average speed:  ${averageSpeed.toFixed(2)} MB/s`);
        }
    }, duration);








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

