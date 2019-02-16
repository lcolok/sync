var axios = require('axios');
var request = require('request');
var AV = require('leanengine');

AV.Cloud.define('expandShortURL', function (request) {
    return expand(request.params.shortURL);
})

require('./identifier').run('vscode||local', async () => {
    var uri = 'https://t.cn/E2dpm9R';
    var resp = await expand(uri);
    console.log(resp)
})

axios.interceptors.request.use(function (request) {
    request['headers']['common']['Accept'] = 'application/json;charset=gb2312;';
    return request;
  }, function (error) {
    return Promise.reject(error);
  });


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
            gzip:false
        }).catch(function (error) {
            uploaderURL = error.response.headers.location;
         
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



