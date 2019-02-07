'use strict';

let request = require('request');
let fs = require('fs');
var axios = require('axios');
const Qs = require("qs");

let httpStream = request({
    method: 'GET',
    url: 'https://baobao-3d.bj.bcebos.com/16-0-205.shuimian.mp4'
});


// 保存成临时文件
let writeStream = fs.createWriteStream('.temp');

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
    console.log(`recevied data size: ${totalLength} KB; proccess:${(totalLength/contentLength*100).toFixed(2)}%`);
    
});

// 下载完成
writeStream.on('close', () => {
    console.log('download finished');
    newUploadShimo(fs.createReadStream('.temp'));
});


const shimoCookie = "shimo_sid=s:UmcqxgbtanN5R-yaheURrLnKpXDD9xlg.jn9p7u5voFG4bsuGZkiBvbURLOACUeoRMrARh3+B5Qs;";

const headers = {
    "Accept": "*/*",
    "Accept-Encoding": "br, gzip, deflate",
    "Accept-Language": "zh-cn",
    "Connection": "keep-alive",
    "Referer": "https://shimo.im/docs/K8CWmBMqMtYYpU1f",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15",
    "X-CSRF-Token": "JDvV3azC-fmyRaI4kR98csJiXEhmprm78WMw",
    "Cookie": shimoCookie + "_csrf=q4MNRquXrxATGBLCwExHVcIs;"
}

async function getToken() {
    var resp = await getDiscussion('BIqrOzKiVEoPs8ke');
    return resp[0];
}

async function tryCatch(promise) {
    try {
        const ret = await promise
        return [ret, null]
    } catch (e) {
        return [null, e]
    }
}


function http(config) {
    return tryCatch(
        axios.create({
            // timeout: 1500,
            transformRequest: [data => Qs.stringify(data)]
        })(config)
    )
}


async function getDiscussion(fileID) {
    var content, list;
    var contentList = [];


    const [resp, error] = await http({
        method: "get",
        url: `https://shimo.im/smapi/files/${fileID}/discussions?limit=99999999`,
        headers: headers,
    })
    if (error) {
        return console.log("getDiscussion请求出错: " + error);
    }
    // console.log("getDiscussion请求成功");

    var list = resp.data.data.list;

    for (var i in list) {
        var item = list[i];
        contentList.push(item.data.content);
    }
    // console.log(contentList);

    //contentList.reverse();//顺序倒过来，正常来说最新的内容在最上面
    //console.log(contentList.join("\n"));
    return contentList;
}

async function newUploadShimo(data) {
    var token = await getToken();
    console.log("拿到石墨评论中的Token:  " + token);

    const r = request.post({
        url: 'https://uploader.shimo.im/upload2',
        // header: headers,
    }, function optionalCallback(err, httpResponse, body) {
        console.log(body);
    })
    const form = r.form();
    form.append('server', 'qiniu');
    form.append('type', 'attachments');
    form.append('accessToken', token);
    // form.append('file', fs.createReadStream('demo/demo.jpg'), {filename: 'unicycle.jpg'});//这个可以强制改名字
    form.append('file', data);

    // var start = new Date();
    // var interval = setInterval(() => {

    //     var uploaded = r.req.connection._bytesDispatched;
    //     var mb = uploaded / (1024 * 1024);
    //     var percent = (uploaded / size * 100).toFixed(0);
    //     if (percent == 100) {
    //         clearInterval(interval);
    //     }

    //     prev = percent;
    //     var end = new Date();
    //     var duration = (end - start) / 1000;
    //     var speed = mb / duration;
    //     console.log(`Uploaded: ${mb.toFixed(2)} MB; Progress: ${percent}%; Upload_Speed: ${speed.toFixed(2)} MB/s`);

    // }, 500);

}