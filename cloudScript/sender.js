'use strict';
const fs = require('fs');
var AV = require('leanengine');


var src = '/Users/seisakubu/Desktop/test.mp4';
var data = fs.createReadStream(src);
var size = fs.lstatSync(src).size;
AV.Cloud.run('recipient', { data: data, size: size });

