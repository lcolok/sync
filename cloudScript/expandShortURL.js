var axios = require('axios');
var request = require('request');
var AV = require('leanengine');

AV.Cloud.define('expandShortURL', function (request) {
    return expand(request.params.shortURL);
})

require('../toolScript/identifier').run('vscode||local', async () => {
    var uri = 'https://t.cn/E2dpm9R';
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
            method: 'get',
            url: uri,
            maxRedirects: 0,
            gzip:true
        }).catch(function (error) {
            uploaderURL = error.response.headers.location;
            console.log(error.response);
            if (uploaderURL.match(/uploader\.shimo\.im/)) {
                axios({
                    method: 'get',
                    url: uploaderURL,
                    maxRedirects: 0,
                }).catch(function (error) {

                    longURL = error.response.headers.location;
                    longURL = decodeURIComponent(longURL);
                    // console.log(uploaderURL);
                    // console.log(longURL);
                    resolve({
                        uploaderURL: uploaderURL,
                        longURL: longURL
                    })

                });
            } else {
                resolve({
                    uploaderURL: undefined,
                    longURL: uploaderURL
                })
            }



        });
    });
}



