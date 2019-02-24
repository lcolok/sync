var AV = require('leanengine');

AV.Cloud.define('deleteContent', function (request) {
    var axios = require('axios');

    var headers = {
        "Accept": "*/*",
        "Accept-Encoding": "br, gzip, deflate",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Referer": "https://shimo.im/docs/K8CWmBMqMtYYpU1f",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.1.1 Safari/605.1.15",
        "X-CSRF-Token": "JDvV3azC-fmyRaI4kR98csJiXEhmprm78WMw",
        "Cookie": process.env.shimoCookie + "_csrf=q4MNRquXrxATGBLCwExHVcIs;"
    };


    async function deleteCotent(fileID, id) {
        axios({
            method: 'delete',
            url: `https://shimo.im/smapi/files/${fileID}/discussions/${id}`,
            headers: headers,
        }).catch(err => {
            console.log(err);
        });
    }

    deleteCotent('K8CWmBMqMtYYpU1f', request.params.id);
})