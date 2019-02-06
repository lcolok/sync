var AV = require('leanengine');
var shimo = require('./scripts/shimoUtil');

AV.Cloud.define('webClipper', (request) => shimo.webClipper(request));

