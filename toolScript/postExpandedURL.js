var AV = require('leancloud-storage');
var axios = require('axios');
var request = require('request');
const Qs = require("qs");

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

async function tryCatch(promise) {
    try {
        const ret = await promise
        return [ret, null]
    } catch (e) {
        return [null, e]
    }
}

function httpRedirect(config) {
    return tryCatch(
        axios.create({
            // timeout: 1500,
            maxRedirects: 0,
            // headers: {
            //     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            //     "Accept-Encoding": "gzip, deflate",
            //     "Accept-Language": "zh-cn",
            //     "Connection": "close",
            //     "Host": "t.cn",
            //     "Upgrade-Insecure-Requests": "1",
            //     "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 12_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/72.0.3626.73 Mobile/15E148 Safari/605.1",
            // },
            transformRequest: [data => Qs.stringify(data)]
        })(config)
    )
}

function http(config) {
    return tryCatch(
        axios.create({
            // timeout: 1500,
            transformRequest: [data => Qs.stringify(data)]
        })(config)
    )
}


async function expand(url) {
    if (!url.match('http')) {
        url = 'https://' + url;
    }
    const [res, error] = await httpRedirect({
        method: "get",
        url: url,
    })
    if (error) {
        var longURL = error.response.headers.location;
        console.log(error.response.headers);
        console.log(longURL);
        return longURL
    };
}

function getUrlVars(url) {
    var vars = {};
    var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

async function unshorten(shortURL){
    return new Promise((resolve)=>{
        request.get({
            url:`https://unshorten.me/s/${shortURL}`,
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.92 Safari/537.36',
            'cookie': '__cfduid=da3a2b34f9d15beae3e0a4d14940ef1271550241931'
        },(error, response, body)=>{
            var expandedURL = body.replace('\n','');
            resolve(expandedURL);
        })
    })
}


async function getR(url) {
    var longURL = await expand(url);
    var r = getUrlVars(longURL)['r'];
    return r;
}

async function postR() {
    var query = new AV.Query('ShimoBed');
    query.doesNotExist("expandedURL");//空值查询
    query.limit(1000);//请求数量上限为1000条
    query.find().then(function (every) {
        console.log("总数:" + every.length);
        every.forEach(function (each) {//each.attributes
            // console.log(each.attributes.r);

            query.get(each.id).then(async function (data) {
                // 成功获得实例
                // console.info(data);
                var shortURL = each.attributes.shortURL;
                var expandedURL = await unshorten(shortURL);
                console.log(expandedURL);
                if(!expandedURL.match('http')){return}
                each.set('expandedURL', expandedURL);
                each.save().then(function () {
                    console.log("expandedURL值已上传到LeanCloud");
                }, function (error) {
                    console.log(JSON.stringify(error));
                });
            }, function (error) {
                // 异常处理
            });

        });

    }).then(function () {
        // 更新成功
    }, function (error) {
        // 异常处理
    });

}

void (async () => {
    await postR();
    // console.log(await getR('t.cn/EtQui0H'));
})();