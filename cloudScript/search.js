var AV = require('leanengine');

AV.Cloud.define('search', function (request) {
    var http = require('request');

    var key = request.params.key;
    http({
        method: 'GET',
        url: 'https://shimo.im/smapi/files/K8CWmBMqMtYYpU1f/discussions?limit=99999999',
    }, function (err, res, body) {
        if (err) {
            console.error('Request failed with response code ' + res.statusCode);
        } else {
            var resp = JSON.parse(body);
            var list = resp.data.list;
            var result = [];
            console.log(list[0]);

            var contentList = [];
            for (var i = 0; i < list.length; i++) {

                var id = list[i].id;
                var content = list[i].data.content;
                var unixus = list[i].unixus;


                contentList.push({ 'content': content, 'id': id, 'unixus': unixus });

                var item = JSON.parse(content);
                var output = emoji(item.type) + ' ' + item.name + ' | ' + item.shortURL;
                var dic = emoji(item.type) + item.name + item.name_trans;
                dic = dic.toLowerCase();
                key = key.toLowerCase();
                if (dic.match(key)) {
                    if (!result.join().match(output)) {//去除重复项目

                        result.push(output);
                    }
                }
            }
            console.log(result);
        }
    });

    function emoji(suffix) {
        var emoji;

        if (suffix.match(/[a-zA-Z]/g)) {
            if (suffix.match(/mp4|mov|avi/ig)) {//根据后缀给出emoji
                emoji = "🎬";//常规视频文件
            } else if (suffix.match(/webm|mkv|avi/ig)) {
                emoji = "▶️";//手机无法播放的非常规视频文件
            } else if (suffix.match(/mp3|ogg|wav|flac|ape|alca|aac/ig)) {
                emoji = "🎵";//音频文件
            } else if (suffix.match(/zip|7z|rar/ig)) {
                emoji = "📦";//压缩包
            } else if (suffix.match(/dmg|iso/ig)) {
                emoji = "💽";//光盘映像
            } else if (suffix.match(/ai|psd|aep/ig)) {
                emoji = "📐";//工程文件
            } else if (suffix.match(/ppt|pptx|key/ig)) {
                emoji = "📽️";//演示文件
            } else if (suffix.match(/ttf|otf/ig)) {
                emoji = "🔤️";//字体文件
            } else if (suffix.match(/doc|pdf/ig)) {
                emoji = "️📄";//文档
            } else {
                emoji = "❓";//未知格式
            }
        } else {
            emoji = suffix;
        }
        return emoji;
    }
});

