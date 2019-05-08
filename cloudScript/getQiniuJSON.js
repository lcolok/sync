
var AV = require('leanengine');
var requestJS = require('request');

AV.Cloud.define('getQiniuJSON', async function (request) {
    return await getQiniuJSON(request);
});


async function getQiniuJSON(request) {

    var fileNameArr = request.params.fileNameArr;
    var shimoToken = await AV.Cloud.run('getShimoTokenRaw');
    console.log(shimoToken);
    return new Promise((resolve, reject) => {
        requestJS.post(`https://uploader.shimo.im/token?server=qiniu&type=attachments&accessToken=${shimoToken}`, {
            json: true,
            body: fileNameArr
            /*             headers: {
                            'Cookie': process.env.shimoCookie,
                        } */
        }, (err, httpResponse, body) => {
            if (!err) {
                console.log(body);
                resolve(body)
            } else {
                reject(false);
            }
        })
    })
}