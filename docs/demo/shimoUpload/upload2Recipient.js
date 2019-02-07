'use strict';
const request = require('request');
const fs = require('fs');
const axios = require('axios');
const Qs = require("qs");
var AV = require('leanengine');

function upload2Recipient(src,size){
    var src = '/Users/seisakubu/Desktop/test.mp4';
    var data = fs.createReadStream(src);
    var size = fs.lstatSync(src).size;
    AV.Cloud.run('recipient', { data: data, size: size });
};
