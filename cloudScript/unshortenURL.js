var axios = require('axios');
var request = require('request');
var AV = require('leanengine');
var cheerio = require('cheerio');
    

AV.Cloud.define('expandShortURL', function (request) {
    return expand(request.params.shortURL);
})

require('../toolScript/identifier').run('vscode||local', async () => {
    var uri = 'https://t.cn/EULom6v';
    var resp = await expand(uri);
    console.log(resp)
})


async function expand(uri) {
    return new Promise((resolve, reject) => {
        uri = uri.match(/((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:\/~\+#]*[\w\-\@?^=%&amp;\/~\+#])?/gm)[0];
        var uploaderURL, longURL;
        if (!uri.match('http')) {
            uri = 'https://' + uri;
        }


        axios({
            method: 'post',
            url: `http://bitly.co/`,
            data:`turl=${uri}&url_done=done`

        }).then(function (resp) {
            var html = resp.data;
            $ = cheerio.load(html);
            var url = $('#trurl').find('a');
            var expandedURL = url[0].attribs.href
            console.log(expandedURL);
            resolve(expandedURL)
        });
    });
}



