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
    this.getScrollStyle()
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
    target() {
      const value = this
      return value
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
      }, 800)
    },
    occurFab() {
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      console.log(scrollTop);
      this.windowSize = { x: window.innerWidth, y: window.innerHeight }
      if (scrollTop > this.windowSize.y * 0.1) {
        this.floatBTN_Occur = 1;
        return 1
      } else {
        this.floatBTN_Occur = 0;
        return 0
      }
    },

  }
})



function searchLC(target, delay) {

  target.lastTime = setTimeout(() => {
    var key = target.keyword;
    showLoading(target);
    target.keywordLasttime = key;
    window.location.href = `#/${key}`
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