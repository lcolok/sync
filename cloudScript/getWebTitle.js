var AV = require('leanengine');

AV.Cloud.define('getWebTitle', (request) => { return getWebTitle(request) });

const cheerio = require('cheerio');
const axios = require('axios');
const http = require('request');
const iconv = require("iconv-lite");

function getWebTitle(request) {
    var url = request.params.url;
    if (!url) { throw new AV.Cloud.Error('url参数不能为空!!'); }
    return new Promise(async (resolve, reject) => {

        /* axios.get(url, {
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        }).then((response) => {
            const body = response.data;
            // 加载 html 内容
            const html = iconv.decode(body, 'gb2312')
            const $ = cheerio.load(html);

            var title = $("title").text();//通过这种方式获得的标题才是最准确的标题
            var qiantuTitle = $("span.pic-title").text();

            var feedback = {
                title: title,
                qiantuTitle: qiantuTitle
            };
            console.log(feedback);
            resolve(feedback);

        }).catch((err) => {
            // console.log(err);
            reject(err);
        }) */
        var feedback = {};

        var respGBK = await axios.get(url, {
            responseType: 'arraybuffer',
            responseEncoding: 'binary'
        });

        const body = respGBK.data;
        // 加载 html 内容
        const htmlGBK = iconv.decode(body, 'gb2312')
        const $ = cheerio.load(htmlGBK);

        feedback.titleGBK = $("title").text();//通过这种方式获得的标题才是最准确的标题
        var qiantuTitle = $("span.pic-title").text();
        if (qiantuTitle) { feedback.qiantuTitle = qiantuTitle }

        var respUTF8 = await axios.get(url);
        const bodyUTF8 = respUTF8.data;
        const $$ = cheerio.load(bodyUTF8);
        feedback.titleUTF8 = $$("title").text();


        console.log(feedback);
        resolve(feedback);



        /* http({
            url: url,
            encoding: null  // 关键代码
        }, function (err, sres, body) {
            var html = iconv.decode(body, 'gb2312')
            var $ = cheerio.load(html, { decodeEntities: false });
            var title = $("title").text();//通过这种方式获得的标题才是最准确的标题
            console.log(title);
        }); */

    })
}


require('../toolScript/identifier.js').run({
    rules: 'vscode',
    func: () => {
        getWebTitle({
            params: {
                url: 'https://www.cnblogs.com/zichi/p/5157887.html'
            }
        })
    }
}) 
