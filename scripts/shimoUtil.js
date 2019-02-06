const id = require('./identifier.js');

async function webClipper(request) {
    console.log('正在进行webClipper页面剪藏..');
    const TurndownService = require('turndown');
    const http = require('request');
    const cheerio = require('cheerio');
    const read = require('node-readability');


    var url = request.params.url;

    if (!url) { return 'url参数不能为空!!' }

    return new Promise((resolve, reject) => {
        read(url, function (err, article, meta) {
            // console.log(article.html);

            var $ = cheerio.load(article.html);
            article.realTitle = $("title").text();//通过这种方式获得的标题才是最准确的标题

            var content = article.content.toString();

            console.log(content);

            content = content.replace(/data-src/gm, 'src');//微信公众号的文章图片的src会写成data-src,因此turndown并不能识别这个label,进而会错误地砍掉图片部分

            var turndownService = new TurndownService();

            var markdown = turndownService.turndown(content);

            var data = markdown;

            const r = http.post({
                url: 'https://shimo.im/lizard-api/files/import',
                gzip: true,
                headers: {
                    "Accept": "*/*",
                    "Accept-Encoding": "br, gzip, deflate",
                    "Accept-Language": "zh-cn",
                    "Authorization": "Bearer 62cbbe058449d3db514c7aece09afe0c13d0e501ed07624478704405d6cef617200823a164c086b87153edbba7acabcbc78c475c53a19a89df10cc2f872855a8",
                    "Connection": "keep-alive",
                    "Content-Type": "multipart/form-data; charset=utf-8; boundary=RNFetchBlob-2139620256",
                    "Cookie": "sensorsdata2015jssdkcross=%22%7B%7D%22",
                    "Expect": "100-continue",
                    "Host": "shimo.im",
                    "User-Agent": "shimo/6042 CFNetwork/976 Darwin/18.2.0",
                }
            }, function optionalCallback(err, response, body) {
                var docURL = `https://shimo.im` + JSON.parse(body).url;
                if (!err) {
                    console.log(docURL);
                    resolve({ code: 0, docURL: docURL });
                } else {
                    reject({ code: 1, error: err });
                }
            });
            const form = r.form();
            form.append('file', data, 'filename.md');//一定要保持md这个后缀,才能被识别
            form.append('name', article.realTitle);
            form.append('type', 'newdoc');
            form.append('parentId', 'SX3sphXKfvofOdRb');//文件夹ID

            article.close();
        });
    });
}



module.exports = {
    webClipper: webClipper
}

id.run({
    rules: 'vscode',
    func: () => {
        webClipper({
            params: {
                url: 'http://data.163.com/18/1222/01/E3JHUBU0000181IU.html'
            }
        })
    }
}) 