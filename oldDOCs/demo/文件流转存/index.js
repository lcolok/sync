'use strict';

let request = require('request');
let fs = require('fs');

// 引入缓存模块
let BufferCache = require('./bufferCache');
const chunkSplice = 2097152; // 2MB
let bufferCache = new BufferCache(chunkSplice);

function getChunks(url, onStartDownload, onDownloading, onDownloadClose) {
    'use strict';

    let totalLength = 0;

    let httpStream = request({
        method: 'GET',
        url: url
    });
    // 由于不需要获取最终的文件，所以直接丢掉
    let writeStream = fs.createWriteStream('/dev/null');

    // 联接Readable和Writable
    httpStream.pipe(writeStream);

    httpStream.on('response', (response) => {
        onStartDownload(response.headers);
    }).on('data', (chunk) => {
        totalLength += chunk.length;
        onDownloading(chunk, totalLength);
    });

    writeStream.on('close', () => {
        onDownloadClose(totalLength);
    });
}

function onStart(headers) {
    console.log('start downloading, headers is :', headers);
}

function onData(chunk, downloadedLength) {
    console.log('write ' + chunk.length + 'KB into cache');
    // 都写入缓存中 
    bufferCache.pushBuf(chunk);
}

function onFinished(totalLength) {
    let chunkCount = Math.ceil(totalLength / chunkSplice);
    console.log('total chunk count is:' + chunkCount);
}

getChunks('https://baobao-3d.bj.bcebos.com/16-0-205.shuimian.mp4', onStart, onData, onFinished);
