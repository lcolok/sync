var AV = require('leancloud-storage');
var axios = require('axios');
var request = require('request');
const Qs = require("qs");
var cheerio = require('cheerio');

"use strict";
try {
    var axios = require('axios');
    var AV = require('leancloud-storage');
    AV.init({
        appId: 'Km0N0lCryHeME8pYGOpOLag5-gzGzoHsz',
        appKey: 'vLplaY3j4OYf3e6e603sb0JX',
    });
} catch (e) {

}


async function unshorten(uri) {
    return new Promise((resolve, reject) => {
        uri = uri.match(/((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/gm)[0];
        var uploaderURL, longURL;
        if (!uri.match('http')) {
            uri = 'https://' + uri;
        }


        axios({
            method: 'post',
            url: `http://bitly.co/`,
            data: `turl=${uri}&url_done=done`

        }).then(function (resp) {
            var html = resp.data;
            $ = cheerio.load(html);
            var url = $('#trurl').find('a');
            var expandedURL = url[0].attribs.href;
            resolve(expandedURL);
        });
    });
}




async function postExpandedURL() {
    var query = new AV.Query('ShimoBed');
    query.doesNotExist("expandedURL");//空值查询
    query.limit(1000);//请求数量上限为1000条
    query.find().then(async (every) => {
        console.log("总数:" + every.length);



        for (let i = 0, len = every.length; i < len; i++) {
            var each = every[i];
            var shortURL = each.attributes.shortURL;
            var expandedURL = await unshorten(shortURL);
            console.log(expandedURL);
            if (!expandedURL.match('http')) { continue }
            each.set('expandedURL', expandedURL);
            each.save().then(function () {
                console.log("expandedURL值已上传到LeanCloud");
            }, function (error) {
                console.log(JSON.stringify(error));
            });

        }




        /* 
                every.forEach(async function (each) {
        
        
                    var shortURL = each.attributes.shortURL;
                    var expandedURL = await unshorten(shortURL);
                    console.log(expandedURL);
                    if (!expandedURL.match('http')) { return }
                    each.set('expandedURL', expandedURL);
                    each.save().then(function () {
                        console.log("expandedURL值已上传到LeanCloud");
                    }, function (error) {
                        console.log(JSON.stringify(error));
                    });
        
        
                }); */

    }).then(function () {
        // 更新成功
    }, function (error) {
        // 异常处理
    });

}

void (async () => {
    await postExpandedURL();
    // console.log(await getR('t.cn/EtQui0H'));
})();