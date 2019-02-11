var app = new Vue({
  el: '#app',
  data: () => ({
    dark: false,

    drawers: ['Default (no property)', 'Permanent', 'Temporary'],
    primaryDrawer: {
      model: null,
      type: 'default (no property)',
      clipped: true,
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

    progress() {
      var num = this.keyword == null ? 0 : this.keyword.length;
      return Math.min(100, num * 10)
    },
    color() {
      return ['error', 'warning', 'success'][Math.floor(this.progress / 40)]
    },

  },
  mounted() {
    this.getScrollStyle();
    this.getQ()
  },
  watch: {
    loader() {
      var _this = this;
      var l = this.loader;
      this[l] = !this[l];

      setTimeout(function () { return _this[l] = false; }, 3000);

      this.loader = null;
    }
  },
  methods: {
    getQ() {
      var keyword = getUrlVars().q;
      if (!keyword) { keyword = ''; }
      return this.keyword = keyword;
    },
    submit(e) {
      // key.Code === 13表示回车键 
      if (e.keyCode === 13) {
        //逻辑处理
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
          searchLC(target, delay);
        } else {
          clearTimeout(target.lastTime);
          searchLC(target, delay);
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

var videoPlayer =new Vue({
  el: '#videoPlayer',
  
})

function searchLC(target, delay) {

  target.lastTime = setTimeout(() => {
    var key = target.keyword;
    showLoading(target);
    target.keywordLasttime = key;
    window.location.href = `?q=${key}`
    console.log('关键词为:' + key);
    // bingDic(key);
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


//以下是新增的Dplayer播放窗口组件




function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
  });
  return vars;
}
var v = getUrlVars()['v'];

if (!v) {
  console.log('没有url参数,播放默认视频');
  v = 'http://lc-1oHwyqv3.cn-n1.lcfile.com/f6affbae989b77d20120.mp4'
} else {
  console.log('正在加载该视频:' + v);
}
document.getElementById('dplayerContainer').setAttribute("src", v);


document.addEventListener("WeixinJSBridgeReady", function () {
  document.getElementById('dplayerContainer').play();
}, false);


initPlayers();

function initPlayers() {
  // dplayer-float
  window.dpFloat = new DPlayer({
      container: document.getElementById('dplayerContainer'),
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

/* 
// console.log(dplayerContainer);
// console.log(dplayerContainer.getElementsByTagName('video')[0]);
currentVideo = dplayerContainer.getElementsByTagName('video')[0];
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

window.dpFloat.fullScreen.request('web');//全屏观看 */