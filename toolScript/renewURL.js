var axios = require('axios');
var request = require('request');


void(async()=>{

    console.log(await unshorten('http://t.cn/E5tKPfh'));


})();

/* function unshorten(shortURL) {
    axios.get(`https://unshorten.me/s/${shortURL}`)
        .then((resp) => {
            console.log(resp.data);
        })
} */



async function unshorten(shortURL){
    return new Promise((resolve)=>{
        request.get({
            url:`https://unshorten.me/s/${shortURL}`
        },(error, response, body)=>{
            var expandedURL = body.replace('\n','');
            resolve(expandedURL);
        })
    })
}
