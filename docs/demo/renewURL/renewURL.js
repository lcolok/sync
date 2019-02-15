var axios = require('axios');
var request = require('request');


void(async()=>{

    console.log(await expand('http://t.cn/E5tKPfh'));


})();

/* function unshorten(shortURL) {
    axios.get(`https://unshorten.me/s/${shortURL}`)
        .then((resp) => {
            console.log(resp.data);
        })
} */


async function expand(shortURL){
    var r1 = await unshorten(shortURL);
    if (r1.match(/uploader\.shimo\.im/)) {
        r2 = await unshorten(r1);
        return {
            uploaderURL:r1,
            longURL:r2
        }
    }else{
        return {
            uploaderURL:undefined,
            longURL:r1
        }
    }
}

async function unshorten(shortURL){
    return new Promise((resolve)=>{
        request.get({
            url:`https://unshorten.me/s/${shortURL}`
        },(error, response, body)=>{
            var feedback = body.replace('\n','');
            resolve(feedback);
        })
    })
}
