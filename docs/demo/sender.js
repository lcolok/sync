const id = require('../../toolScript/identifier.js');

id.run({
    rules: 'vscode||local',
    func: () => {
        'use strict';
        const fs = require('fs');
        var AV = require('leanengine');
        const request = require('request');

        AV.init({
            appId: '1oHwyqv3qyzH6hFsjCJULJ31-gzGzoHsz',
            appKey: 'g7G4uPGRbJc5GaK4yn36FqkC',
        });

        var src = '/Users/seisakubu/Desktop/test.mp4';
        var data = fs.createReadStream(src);
        var size = fs.lstatSync(src).size;
        // console.log(data);
        var name = src.split('/').pop();

        const r = request.post({
            url: 'https://1ohwyqv3.engine.lncld.net/1.1/functions/recipient',
            // url: '127.0.0.1:3000/1.1/functions/recipient',
            headers: {
                "X-LC-Id": "1oHwyqv3qyzH6hFsjCJULJ31-gzGzoHsz",
                "X-LC-Key": "g7G4uPGRbJc5GaK4yn36FqkC",
                "Content-Type": "application/json"
            }
        }, function optionalCallback(err, httpResponse, body) {
            console.log(body);
        })
        const form = r.form();
        form.append('server', 'qiniu');
        form.append('type', 'attachments');
        // form.append('file', fs.createReadStream('demo/demo.jpg'), {filename: 'unicycle.jpg'});//这个可以强制改名字
        form.append('file', data, { filename: name });


        var start = new Date();
        var interval = setInterval(() => {
            var prev;
            var uploaded = r.req.connection._bytesDispatched;
            var mb = uploaded / (1024 * 1024);
            var percent = (uploaded / size * 100).toFixed(0);
            if (percent == 100) {
                clearInterval(interval);
            }

            prev = percent;
            var end = new Date();
            var duration = (end - start) / 1000;
            var speed = mb / duration;
            console.log(`Uploaded: ${mb.toFixed(2)} MB; Progress: ${percent}%; Upload_Speed: ${speed.toFixed(2)} MB/s`);

        }, 500);


    }
}) 