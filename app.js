'use strict';

var express = require('express');
var timeout = require('connect-timeout');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var AV = require('leanengine');
var multer = require('multer');
var request = require('request');
var fs = require('fs');


// 加载云函数定义，你可以将云函数拆分到多个文件方便管理，但需要在主文件中加载它们
require('require-all')({
  dirname: __dirname + '/cloudScript',
  excludeDirs: /^public$/,
  filter: function (fileName) {
    if (fileName == 'tempCodeRunnerFile.js') return; //排除掉tempCodeRunnerFile.js这种临时生成的文件
    if (!fileName.match(/(.+)\.js$/)) return; //符合js命名格式的才能通过
    return fileName;
  },
})

var app = express();

// 设置模板引擎
app.set('views', path.join(__dirname, 'docs'));
var ejs = require('ejs');  //我是新引入的ejs插件,让express也能够加载html
app.engine('html', ejs.__express);
app.set('view engine', 'html');


// 设置默认超时时间
app.use(timeout('240s'));

// 加载云引擎中间件
app.use(AV.express());



app.enable('trust proxy');
app.use(AV.Cloud.HttpsRedirect());// 重定向到 HTTPS
app.use(express.static(path.join(__dirname, 'docs')));//利用 Express 托管静态文件

app.use(bodyParser.json({ limit: '1000gb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.get('/', async function (req, res) {

  var query = req.query;
  if (!query) { return }

  if (query.r) {
    var query = new AV.Query('randomTCN');
    var redirectURL = await new Promise((resolve) => {
      query.equalTo('r', r).find().then(e => {
        // console.log(e);
        if (e.length != 0) {
          if (e.length > 1) { alert(`该r出现了${e.length}次,如果出现重定向网址不正确,请删除重复项`) };
          var redirectURL = e[0].attributes.redirectURL;
          if (redirectURL) {

            if (!redirectURL.toLowerCase().match('http')) {
              redirectURL = 'https://' + redirectURL;
            };
            console.log(redirectURL);
            resolve(redirectURL);
          } else {
            console.log(`${r}并没有对应的redirectURL`);
          }
        } else {
          console.log(`不存在此r:${r}`);
        }
      });
    })
    res.redirect(302, redirectURL);
    return
  }


  res.render('index', { currentTime: new Date() });
});


app.get('/aaa', function (req, res) {
  res.redirect('http://www.baidu.com')
});

app.get('/o', function (req, res) {
  res.redirect('./oldver/')
});

app.get('/oldver', function (req, res) {
  res.render('./oldver/', { currentTime: new Date() });
});

//只能以Form形式上传name为mFile的文件



app.post('/upload', function (req, res) {
  console.log("---------访问上传路径-------------");

  //var upload = multer({ dest: 'upload/'}).single('mFile');
  var upload = multer({ dest: 'upload/' }).any();

  /** When using the "single"
      data come in "req.file" regardless of the attribute "name". **/
  upload(req, res, function (err) {
    //添加错误处理
    if (err) {
      console.log(err);
      return;
    }

    uploadShimo(req, res);

    /*     var src = fs.createReadStream(tmp_path);
        var dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function () {
          res.end();
        });
        src.on('error', function (err) {
    
          res.end();
          console.log(err);
        });
     */
  });

  async function uploadShimo(req, res) {

    req.file = req.files[0];
    var src = req.file.path;
    console.log(src);//临时路径

    /** The original name of the uploaded file
        stored in the variable "originalname". **/
    var filename = req.file.originalname;//文件原始名字

    /** A better way to copy the uploaded file. **/
    console.log(filename);

    var token = await getTokenShimo();
    console.log("拿到石墨评论中的Token:  " + token);

    var data = fs.createReadStream(src);
    var size = fs.lstatSync(src).size;
    console.info(size);

    const r = request.post({
      url: 'https://uploader.shimo.im/upload2',
      // header: headers,
    }, function optionalCallback(err, httpResponse, body) {//上传成功后的callback
      console.log(body);
      res.send(body);//返回消息,告诉前端已经上传成功
      var json = JSON.parse(body);

      var arr = filename.split('.');
      var suffix = arr.pop();
      var realName = arr.join('.');

      json.data.type = suffix;
      json.data.name = realName;

      AV.Cloud.run('updateShimo', json);
    })
    const form = r.form();
    form.append('server', 'qiniu');
    form.append('type', 'attachments');
    form.append('accessToken', token);
    // form.append('file', fs.createReadStream('demo/demo.jpg'), {filename: 'unicycle.jpg'});//这个可以强制改名字
    form.append('file', data, { filename: filename });

    var start = new Date();
    var prev;
    var interval = setInterval(() => {

      var uploaded = r.req.connection._bytesDispatched;
      var mb = uploaded / (1024 * 1024);
      var percent = (uploaded / size * 100).toFixed(0);
      if (percent >= 100) {
        clearInterval(interval);
      }

      prev = percent;
      var end = new Date();
      var duration = (end - start) / 1000;
      var speed = mb / duration;
      console.log(`Uploaded: ${mb.toFixed(2)} MB; Progress: ${percent}%; Upload_Speed: ${speed.toFixed(2)} MB/s`);

    }, 500);
  }


  function getTokenShimo() {
    return new Promise((resolve, reject) => {
      request.post('https://shimo.im/api/upload/token', {
        json: true,
        headers: {
          'Cookie': process.env.shimoCookie,
        }
      }, (err, httpResponse, body) => {
        if (!err) {
          var token = body.data.accessToken.toString();
          // console.log(token);
          resolve(token)
        } else {
          reject(false);
        }
      })
    })
  }


});



// 可以将一类的路由单独保存在一个文件中
app.use('/todos', require('./routes/todos'));

app.use(function (req, res, next) {
  // 如果任何一个路由都没有返回响应，则抛出一个 404 异常给后续的异常处理器
  if (!res.headersSent) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  }
});

// error handlers
app.use(function (err, req, res, next) {
  if (req.timedout && req.headers.upgrade === 'websocket') {
    // 忽略 websocket 的超时
    return;
  }

  var statusCode = err.status || 500;
  if (statusCode === 500) {
    console.error(err.stack || err);
  }
  if (req.timedout) {
    console.error('请求超时: url=%s, timeout=%d, 请确认方法执行耗时很长，或没有正确的 response 回调。', req.originalUrl, err.timeout);
  }
  res.status(statusCode);
  // 默认不输出异常详情
  var error = {};
  if (app.get('env') === 'development') {
    // 如果是开发环境，则将异常堆栈输出到页面，方便开发调试
    error = err;
  }
  res.render('error', {
    message: err.message,
    error: error
  });
});

module.exports = app;
