


var app = new Vue({
  el: '#app',
  data: () => ({
    tabs: null,

    dark: false,
    bottomSheet: false,
    floatPlayBTN_Occur: false,
    currentVideoTitle: '',
    currentVideoSubheading: '',
    searchDuration: 0,
    keywordLasttime: '',
    typeList: [
      { size:'',icon: 'mdi-movie', text: '视频' },
      { size:'',icon: 'mdi-music', text: '音乐' },
      { size:'',icon: 'mdi-image-area', text: '图片' },
      { size:'',icon: 'mdi-file-pdf', text: 'PDF' },
      { size:'20',icon: 'fas fa-file-archive fa-xs', text: '压缩包' },
    ],
    mainList: {
      selected: [],
      items: [
        {
          icon: 'video_library',
          iconClass: 'green lighten-1 white--text',
          action: '15 min',
          headline: 'Brunch this weekend?',
          name: 'Ali Connors',
          subtitle: "I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        },
        {
          icon: 'library_music',
          iconClass: 'grey lighten-1 white--text',
          action: '2 hr',
          headline: 'Summer BBQ',
          name: 'me, Scrott, Jennifer',
          subtitle: "Wish I could come, but I'm out of town this weekend."
        },
        {
          icon: 'assignment',
          iconClass: 'blue white--text',
          action: '6 hr',
          headline: 'Oui oui',
          name: 'Sandra Adams',
          subtitle: 'Do you have Paris recommendations? Have you ever been?'
        },
        {
          icon: 'call_to_action',
          iconClass: 'amber white--text',
          action: '12 hr',
          headline: 'Birthday gift',
          name: 'Trevor Hansen',
          subtitle: 'Have any ideas about what we should get Heidi for her birthday?'
        },
        {
          icon: 'picture_as_pdf',
          iconClass: 'grey lighten-1 white--text',
          action: '18hr',
          headline: 'Recipe to try',
          name: 'Britta Holt',
          subtitle: 'We should eat this: Grate, Squash, Corn, and tomatillo Tacos.'
        }
      ]
    }
    ,
    drawers: ['Default (no property)', 'Permanent', 'Temporary'],
    searchType: {
      items: ['视频', '音频', '图片', '文档', '压缩包', '软件', '幻灯片'],
      value: []
    },
    snackbar: {


    },
    primaryDrawer: {
      model: false,//决定一开始是展开状态还是折叠状态
      type: 'default (no property)',
      clipped: false,
      floating: false,
      mini: false
    },
    footer: {
      inset: false
    },
    searchLoading: false,
    keyword: '',
    custom: true,
    loader: null,
    loading: false,
    loading2: false,
    loading3: false,
    loading4: false,
    alert: true,
    scrollStyle: "",
    paste: true,
    videoImage: {},
    rules: {
      required: value => !!value || '必填信息',
      counter: value => (value == null ? 0 : value.length) <= 20 || '最多只能填写20个字符',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
      entropy: (value) => {
        var shannonEntropy = newEntropy(value).toString();
        console.log(shannonEntropy);
        return `信息熵:${shannonEntropy}`
      }
    },
  }),
  computed: {
    innerHeight() {
      return window.innerHeight * 0.8;
    },
    progress() {
      var num = this.keyword == null ? 0 : this.keyword.length;
      return Math.min(100, num * 10)
    },
    color() {
      return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
    },
    searchRange() {
      var all = this.searchType.value.join('|');

      if (all.length > 4) {
        all = all.slice(0, 4) + '...'
      }
      return all;
    },
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      // console.log(flag);
      if (flag) { return false } else { return true }
    },
  },
  mounted() {
    this.getScrollStyle();
    this.getQ()
  },
  watch: {
    bottomSheet() {
      if (this.bottomSheet == false) {
        dpFloat.pause();
      } else {
        this.floatPlayBTN_Occur = true;
        dpFloat.play();
      }

    },
    loader() {
      var _this = this;
      var l = this.loader;
      this[l] = !this[l];

      setTimeout(function () { return _this[l] = false; }, 3000);

      this.loader = null;
    }
  },
  methods: {

    closeDpFloat() {
      if (this.bottomSheet == true) {
        this.bottomSheet = false;
      }
    },
    renderSize(value) {
      if (null == value || value == '') {
        return "0 Bytes";
      }
      var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
      var index = 0,
        srcsize = parseFloat(value);
      index = Math.floor(Math.log(srcsize) / Math.log(1024));
      var size = srcsize / Math.pow(1024, index);
      //  保留的小数位数
      size = size.toFixed(2);
      return `${size} ${unitArr[index]}`;
    },
    howToPlay(item) {
      console.log(item.type);
      switch ((item.type).toLowerCase()) {
        case 'mov':
        case 'mp4':
          // document.getElementById('dplayer').setAttribute("src", item.shortURL);
          if (this.currentVideoTitle !== item.name) {//标题跟之前的不同才会切换新视频进行播放
            this.currentVideoTitle = item.name;
            if (item.name !== item.name_trans) {
              this.currentVideoSubheading = item.name_trans;
            } else {
              this.currentVideoSubheading = (item.size / 1048576).toFixed(2) + 'MB'
            }
            var url = item.expandedURL ? item.expandedURL : item.uploaderURL;
            dpFloat.notice(`正在加载:${item.name}`, 0, 0.8);
            dpFloat.switchVideo({
              url: url,
            });
          }

          dpFloat.play();
          this.bottomSheet = true;


          dpFloat.on('playing', function () {

            if (dpFloat.video.currentTime == 0) {
              dpFloat.notice(`成功加载!`, 1000, 0.8);
            }

          });
          break;
        default:
          return;
      }
    },
    toggle(index) {
      const i = this.mainList.selected.indexOf(index)

      if (i > -1) {
        this.mainList.selected.splice(i, 1)
      } else {
        this.mainList.selected.push(index)
      }
    },

    pasteFromClipboard() {
      this.paste = !this.paste
    },
    getQ() {
      var keyword = getUrlVars().q;
      if (!keyword) { return this.keyword = '' }
      else { return this.keyword = decodeURIComponent(keyword); }
    },
    submit(e) {
      // key.Code === 13表示回车键 
      if (e.keyCode === 13) {
        //逻辑处理
        this.searchByKeyword({ delay: 0 })
        this.$refs.searchBar.blur();
      }
    },
    getScrollStyle() {

      return this.scrollStyle = `max-height: ${window.innerHeight - 120}px`
    },
    searchByKeyword(request) {
      var delay = request.delay;
      var target = this;
      if (target.keywordLasttime != target.keyword) {
        if (target.lastTime == 0) {
          searchDelay(target, delay);
        } else {
          clearTimeout(target.lastTime);
          searchDelay(target, delay);
        }
      }
    },




  },

})

var floatBTN = new Vue({
  el: '#floatBTN',//Floating Action Button
  data: () => ({
    direction: 'top',
    fab: false,
    fling: false,
    hover: true,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: 'scale-transition',
    floatBTN_Occur: 0,
    windowSize: {},
  }),

  computed: {
    activeFab() {
      switch (this.fab) {
        case true: return { color: 'red', icon: 'close' }
        case false: return { color: "blue darken-2", icon: 'more_horiz' }
        default: return {}
      }
    },
    backToSearchTarget() {
      return app.$refs.searchBar
    },
    backToSearchOptions() {
      return {
        offset: 16,
        duration: 300,
        easing: 'easeInOutCubic'
      }
    },
  },
  watch: {
    top(val) {
      this.bottom = !val
    },
    right(val) {
      this.left = !val
    },
    bottom(val) {
      this.top = !val
    },
    left(val) {
      this.right = !val
    },

  },

  mounted() {

  },

  methods: {
    hoverOrNot() {
      this.hover = false;
      setTimeout(() => {
        this.hover = true;
      }, 800);
    },

    occurFab() {
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      console.log(scrollTop);
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      if (scrollTop > this.windowSize.y * 0.1) {
        this.floatBTN_Occur = 1;
        return 1
      } else {
        this.fab = false;//确保浮动按钮消失的时候,弹出来的按钮也是收起状态
        this.floatBTN_Occur = 0;
        return 0
      }
    },

  }
})


function searchDelay(target, delay) {

  target.lastTime = setTimeout(() => {
    var key = target.keyword;
    showLoading(target);
    // window.location.href = `?q=${key}`
    console.log('关键词为:' + key);
    // bingDic(key);
    searchShimo(key);
  }, delay)
}


function showLoading(target) {
  target.custom = false;
  target.searchLoading = true;
  setTimeout(() => {
    target.custom = true;
    target.searchLoading = false;
  }, 2000)
}

function process(s, evaluator) {
  var h = Object.create(null), k;
  s.split('').forEach(function (c) {
    h[c] && h[c]++ || (h[c] = 1);
  });
  if (evaluator) for (k in h) evaluator(k, h[k]);
  return h;
};

function continuity(s) {
  var sc = 0, arr = s.split(''), len = s.length;

  for (var i = 0; i < len; i++) {
    for (var j = 1; j < len - i; j++) {
      if (arr[i] == arr[i + j]) {
        sc = sc + j;
      } else { break; }
    }
  }
  return sc / len
}

function entropy(s) {
  var sum = 0, len = s.length;
  process(s, function (k, f) {
    var p = f / len;
    sum -= p * Math.log(p) / Math.log(2);
  });
  return sum;
};


function newEntropy(s) {
  var sum_1 = 0, len = s.length;
  process(s, function (k, f) {
    var p = f / len;
    sum_1 -= p * Math.log(p) / Math.log(2);
  });

  var sum_2 = continuity(s);

  var sum = sum_1 - sum_2 * 2;

  return sum;
};


async function bingDic(word) {

  try {
    var resp = await axios({
      method: 'GET',
      url: "http://xtk.azurewebsites.net/BingDictService.aspx",
      params: { Word: word, Samples: false },
    });
    if (resp.defs != null) {
      var arr;
      resp.defs.forEach(e => {
        arr.push(e.def)
      })
      console.log(arr.join(''));
      return arr.join('')
    }
  } catch (e) {
    console.log(e);
  }


}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = decodeURI(value);
  });
  return vars;
}

function showTop20() {
  app.snackbar = {
    show: true,
    color: 'info',
    ripple: false,
    snackbarText: '已为你搜索最近20条项目',
    snackbarIcon: 'update',
    action: () => {

    }
  }
}


async function searchShimo(key) {
  var startTime = new Date();
  var result = "";

  if (!key) {
    var data = await AV.Cloud.run('updateShimo');
    console.log(data);

    if (data > 0) {
      showUpdate(data);
    } else {
      showTop20();

    }

    var query = new AV.Query('ShimoBed');
    query.descending("updatedAt");
    query.limit(20);//请求数量上限为1000条
    var every = await query.find();

    console.log(every);

    result = makeAList(every);
    // console.log(result);
  } else {

    var result = await searchLC(key);
    // alert(JSON.stringify(this.todos[0]));
    if (result == "") {

      // Vue.toasted.show(`找不到关于“${key}”的项目`, {
      //   position: 'top-center',
      //   theme: 'toasted-primary',//Theme of the toast you prefer['toasted-primary', 'outline', 'bubble']
      //   duration: 3000,
      //   icon: { name: "search" },
      //   iconPack: 'fontawesome',
      //   fitToScreen: "true",
      //   type: "error"//Type of the Toast ['success', 'info', 'error']
      //   // fullWidth:"true",
      // });

      app.snackbar = {
        show: true,
        color: 'error',
        ripple: false,
        snackbarText: `找不到关于“${key}”的项目`,
        snackbarIcon: 'report_problem',
        action: () => {

        }
      }
      return
    }
  }
  app.keywordLasttime = key;
  console.log(app.mainList.items);
  console.log(result);
  app.mainList.items = result;
  var endTime = new Date();
  app.searchDuration = (endTime - startTime) / 1000;//毫秒转成秒


}




//paste事件监听
document.addEventListener("paste", function (e) {

  var cbd = e.clipboardData;
  var ua = window.navigator.userAgent;

  // 如果是 Safari 直接 return
  if (!(e.clipboardData && e.clipboardData.items)) {
    return;
  }

  // Mac平台下Chrome49版本以下 复制Finder中的文件的Bug Hack掉
  if (cbd.items && cbd.items.length === 2 && cbd.items[0].kind === "string" && cbd.items[1].kind === "file" &&
    cbd.types && cbd.types.length === 2 && cbd.types[0] === "text/plain" && cbd.types[1] === "Files" &&
    ua.match(/Macintosh/i) && Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
    return;
  }

  for (var i = 0; i < cbd.items.length; i++) {
    var item = cbd.items[i];
    console.log(item.kind);
    if (item.kind == "file") {
      var blob = item.getAsFile();
      if (blob.size === 0) {
        return;
      }
      console.log(blob);
      // blob 就是从剪切板获得的文件 可以进行上传或其他操作
    }
  }
}, false);








//以下是新增的Dplayer播放窗口组件



var v = getUrlVars()['v'];

if (!v) {
  console.log('没有url参数,播放默认视频');
  v = 'https://uploader.shimo.im/f/5Xl8MXleYAwTWkZV.mp4'
} else {
  console.log('正在加载该视频:' + v);
}
document.getElementById('dplayer').setAttribute("src", v);


document.addEventListener("WeixinJSBridgeReady", function () {
  document.getElementById('dplayer').play();
}, false);


initPlayers();

function initPlayers() {
  // dplayer-float
  dpFloat = new DPlayer({
    container: document.getElementById('dplayer'),
    preload: 'auto',
    autoplay: false,
    screenshot: true,
    video: {
      url: v,
    },
    contextmenu: [

      {
        text: '画中画',
        click: (player) => {
          console.log(player);
          currentVideo.requestPictureInPicture();
        }
      },
      {
        text: '去石墨床看看',
        link: ''
      }
    ],
  });
};


var log = function (content) {
  if (!output.innerHTML) {
    output.innerHTML = content;
  } else {
    output.innerHTML += '<br>' + content;
  }
  output.scrollTop = 99999;
};

var pipWindow, currentVideo;

currentVideo = dplayer.getElementsByTagName('video')[0];
/*
// console.log(dplayer);
// console.log(dplayer.getElementsByTagName('video')[0]);
currentVideo = dplayer.getElementsByTagName('video')[0];
pipBtn.addEventListener('click', function (event) {
  log('切换Picture-in-Picture模式...');
  // 禁用按钮，防止二次点击
  this.disabled = true;
  try {
      if (currentVideo !== document.pictureInPictureElement) {
          // 尝试进入画中画模式
          currentVideo.requestPictureInPicture();
      } else {
          // 退出画中画
          document.exitPictureInPicture();
      }
  } catch (error) {
      log('&gt; 出错了！' + error);
  } finally {
      this.disabled = false;
  }
});

// 点击切换按钮可以触发画中画模式，同样，在有些浏览器中，右键也可以切换，甚至可以自动进入画中画模式
currentVideo.addEventListener('enterpictureinpicture', function (event) {
  log('&gt; 视频已进入Picture-in-Picture模式');
  pipBtn.value = pipBtn.value.replace('进入', '退出');

  pipWindow = event.pictureInPictureWindow;
  log('&gt; 视频窗体尺寸为：' + pipWindow.width + ' × ' + pipWindow.height);

  // 添加resize事件，一切都是为了测试API
  pipWindow.addEventListener('resize', onPipWindowResize);
});
// 退出画中画模式时候
currentVideo.addEventListener('leavepictureinpicture', function (event) {
  log('&gt; 视频已退出Picture-in-Picture模式');
  pipBtn.value = pipBtn.value.replace('退出', '进入');
  // 移除resize事件
  pipWindow.removeEventListener('resize', onPipWindowResize);
});
// 视频窗口尺寸改变时候执行的事件
var onPipWindowResize = function (event) {
  log('&gt; 窗口尺寸改变为：' + pipWindow.width + ' × ' + pipWindow.height);

}
// 特征检测
if ('pictureInPictureEnabled' in document == false) {
  log('当前浏览器不支持视频画中画。');
  togglePipButton.disabled = true;
}


console.log($(".dplayer-menu-item:contains('关于作者')").remove());//移除关于作者的右键按钮
console.log($(".dplayer-menu-item:contains('DPlayer v1.25.0')").remove());//移除DPlayer版本号的右键按钮

dpFloat.fullScreen.request('web');//全屏观看 */




$(".dplayer-menu-item:contains('关于作者')").remove();//移除关于作者的右键按钮
$(".dplayer-menu-item:contains('DPlayer v1.25.0')").remove();//移除DPlayer版本号的右键按钮

