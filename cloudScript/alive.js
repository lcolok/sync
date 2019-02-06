var AV = require('leanengine');

AV.Cloud.define('alive', function(request) {
    return true
});