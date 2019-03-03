'use strict'

// 禁止右键菜单
document.oncontextmenu = function () { return false; };
// 禁止文字选择
// document.onselectstart = function(){ return false; };
// 禁止复制
// document.oncopy = function(){ return false; };
// 禁止剪切
// document.oncut = function(){ return false; };
// 禁止粘贴
// document.onpaste = function(){ return false; };

var app = new Vue({
  el: '#app',

  data: () => ({
    user: null,

    loadingDialog: {},
    fileDescription: [
      {
        rule: ["mp4", "mov", "webm"],
        emoji: "🎬",//常规视频文件
        type: "视频",
        size: '',
        icon: 'mdi-movie',
        canPlay: {
          icon: 'mdi-play',
          color: 'red',
        },
      },
      {
        rule: ["mkv", "avi", "flv"],
        emoji: "▶️",//常规视频文件
        type: "非标视频",
        size: '',
        icon: 'mdi-file-video',
      },
      {
        rule: ["mp3", "ogg", "wav", "flac", "ape", "alca", "aac"],
        emoji: "🎵",//音频文件
        type: "音频",
        size: '',
        icon: 'mdi-music',
      },
      {
        rule: ["zip", "7z", "rar"],
        emoji: "📦",//压缩包
        type: "压缩包",
        size: '20',
        icon: 'fas fa-file-archive fa-xs',
      },
      {
        rule: ["dmg", "iso"],
        emoji: "💽",//光盘映像
        type: "光盘映像",
        size: '',
        icon: 'mdi-harddisk',
      },
      {
        rule: ["ai", "psd", "aep"],
        emoji: "📐",//工程文件
        type: "工程文件",
        size: '',
        icon: 'mdi-briefcase-edit',
      },
      {
        rule: ["ppt", "pptx", "key"],
        emoji: "📽️",//演示文件
        type: "演示文件",
        icon: "mdi-projector-screen",
      },
      {
        rule: ["ttf", "otf"],
        emoji: "🔤️",//字体文件
        type: "字体",
        size: '',
        icon: 'mdi-format-font',
      },
      {
        rule: ["doc", "pdf", "txt"],
        emoji: "📄",//文档
        type: "文档",
        size: '',
        icon: 'mdi-file-pdf',
      },
      {
        rule: ["puppet"],
        emoji: "🤖",//
        type: "Ch人偶模型",
        size: '',
        icon: 'mdi-robot',
      },
      {
        rule: [],
        emoji: "❓",//未知格式
        type: "未知格式",
        size: '',
        icon: 'mdi-file-question',
      }
    ],

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


    showMenuIndex: 'init',
    MenuX: 0,
    MenuY: 0,
    showMenu: false,
    deleteConfirmDialog: false,
    copyBtn: null, //存储初始化复制按钮事件
    mobile: null,
    infoPanel: false,
    videoHeight: 0,
    videoWidth: 0,
    moreBTN: {
      icon: 'mdi-settings', text: '更多操作', moreBTN: true, showInSheet: true, action: () => {
        clearTimeout(app.moreBTNTimer);
        app.moreBTN.icon = 'mdi-settings mdi-spin';
        app.moreBTNTimer = setTimeout(() => {
          app.moreBTN.icon = 'mdi-settings';
        }, 360);//齿轮转动


      }
    },
    bottomSheetToolbar: [
      {
        icon: 'mdi-clipboard-text', text: '复制短链', showInSheet: true, name: 'copyBTN', action: (result, e) => {
          clearTimeout(app.clipboardTimer);
          app.bottomSheetToolbar[0].icon = 'mdi-clipboard-check';
          app.clipboardTimer = setTimeout(() => {
            app.bottomSheetToolbar[0].icon = 'mdi-clipboard-text';
          }, 1000);

          // console.log(result);
        }

      },
      {
        icon: 'mdi-download', text: '直接下载', showInSheet: true, action: (e) => {
          if (e.attributes) {
            var url = e.attributes.expandedURL ? e.attributes.expandedURL : e.attributes.uploaderURL;
            app.downloadStraightly(url);
            return
          }
          console.error('下载失败');
          // app.downloadStraightly(app.currentVideo.attributes.url);
        }
      },
      /*      {
             icon: 'mdi-cloud-upload', text: '上传专用', showInSheet: true, action: () => {
     
             }
           },
      */

      {
        icon: 'mdi-cloud-upload', text: '测试可删', action: () => {

        }
      },
      {
        icon: 'mdi-cloud-upload', text: '测试可删', action: () => {

        }
      },
      {
        icon: 'mdi-delete', text: '删除该项', subheader: '敏感操作', action: (deleteOjbect) => {
          app.deleteOjbect = deleteOjbect;
          app.deleteConfirmDialog = true;
        }
      },


    ],
    generalMenu: [
      {
        icon: 'mdi-page-previous', text: '回到旧版', action: () => {
          var currentURL = window.location.href;
          if (currentURL.match(/\?/)) {
            console.log(currentURL.split('?')[0]);
            return window.location.href = currentURL.split('?')[0] + 'oldver';
          } else { return window.location.href = (window.location.href + 'oldver'); }
        }
      },
      {
        icon: 'mdi-cloud-upload', text: '上传专用', action: () => {
          window.open('https://shimo.im/docs/K8CWmBMqMtYYpU1f');
        }
      },
      {
        icon: 'mdi-database-edit', text: '数据管理', action: () => {
          window.open('https://leancloud.cn/dashboard/data.html?appid=Km0N0lCryHeME8pYGOpOLag5-gzGzoHsz#/ShimoBed')
        }
      },
      {
        icon: 'mdi-apple-safari', text: '创建捷径', action: () => {
          // window.location.href='mqqapi://';//打开QQ
          var encodedURL = encodeURIComponent("https://www.baidu.com");
          window.location.href = `x-web-search://?${encodedURL}`
        }
      },
      {
        icon: 'mdi-logout', text: '安全登出', action: () => {
          app.logOut();
        }
      }
    ],
    tabs: null,
    mainView: true,
    dark: false,
    bottomSheet: false,
    floatPlayBTN_Occur: false,
    currentVideo: { attributes: {} },
    searchDuration: 0,
    keywordLasttime: null,
    typeList: [

      {
        size: '20', icon: 'fas fa-globe-americas', text: '全部'
      },
      { size: '', icon: 'mdi-movie', text: '视频' },
      { size: '', icon: 'mdi-music', text: '音乐' },
      { size: '', icon: 'mdi-image-area', text: '图片' },
      { size: '', icon: 'mdi-file-pdf', text: 'PDF' },
      { size: '20', icon: 'fas fa-file-archive fa-xs', text: '压缩包' },

    ],
    mainList: {
      selected: [],
      results: [
        /*         {
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
                } */
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
    arrowDegree: 0,
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
      return app.$refs.searchBar.focus();
    },
    backToSearchOptions() {
      return {
        offset: 16,
        duration: 300,
        easing: 'easeInOutCubic'
      }
    },
    style() {
      return { transform: 'rotate(' + this.arrowDegree / 360 + 'turn)' }
    },
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
    showArrow() {
      if (this.mobile) { return false } else { return true }
    },
    videoView() {
      var H = this.mobile ? 180 : 600;
      var rate = 16 / 9;
      var W = H * rate;
      var W = (W < window.innerWidth) ? window.innerWidth : W;

      return {
        height: H,
        width: W
      }
    },
  },
  created() {
    this.autoLogin();
    this.captchaInit();
  },
  mounted() {
    if (this.user) {
      this.getScrollStyle();
      this.initPlayers();
      //处理Params
      this.getQ();
      this.getV();
      this.getID();
      this.pasteEvent();
    }
  },
  watch: {

    'user.objectId': {
      handler: function (id) {
        if (id) {
          console.log(id);
        } else {

        }
      },
    },
    bottomSheet() {
      if (this.bottomSheet == false) {
        this.dpFloat.pause();
      } else {
        this.floatPlayBTN_Occur = true;
        this.dpFloat.play();
      }

    },
    loadingDialog(val) {
      if (!val) return
      console.log(val);
      // setTimeout(() => (this.loadingDialog = false), 4000)
    },
    /*     loader() {
          var _this = this;
          var l = this.loader;
          this[l] = !this[l];
    
          setTimeout(function () { return _this[l] = false; }, 3000);
    
          this.loader = null;
        } */
  },
  methods: {
    autoLogin() {
      var user = AV.User.current()
      if (user) {
        // user.isAuthenticated().then(function(authenticated) {
        //   if (authenticated) {
        this.user = user.toJSON()
        //   }
        // }
      }
    },
    captchaInit() {
      AV.Captcha.request().then(function (captcha) {
        // console.log(captcha);
        // console.log(app.$refs.captchaImage);
        captcha.bind({
          textInput: 'captchaCode', // the id for textInput
          image: 'captchaImage',    // the id for image element
          verifyButton: 'verify',    // the id for verify button
        }, {
            success: function (validateCode) {
              console.log('验证成功，下一步')
            },
            error: function (error) {
              console.error(error.message)
            },
          });
      });
    },
    logOut: function () {
      AV.User.logOut()
      this.user = null;
    },
    signUp() {

      var username = $('#inputUsername').val();
      var password = $('#inputPassword').val();
      var email = $('inputEmail').val();

      // LeanCloud - 注册
      // https://leancloud.cn/docs/leanstorage_guide-js.html#注册
      var user = new AV.User();
      user.setUsername(username);
      user.setPassword(password);
      user.setEmail(email);
      user.signUp().then(function (user) {
        // 注册成功
        console.log(user);
        app.user = user.toJSON();

      }).catch(alert);
    },
    login() {
      var username = $('#inputUsername').val();
      var password = $('#inputPassword').val();

      // LeanCloud - 登录
      // https://leancloud.cn/docs/leanstorage_guide-js.html#用户名和密码登录
      AV.User.logIn(username, password).then(function (user) {
        // 登录成功
        console.log(user);
        app.user = user.toJSON();
        console.log(app.user);
      }).catch(alert);
    },
    copySuccess() {
      app.snackbar.show = false;
      app.snackbar = {
        show: true,
        color: 'success',
        ripple: false,
        snackbarText: '已复制',
        snackbarIcon: 'file_copy',
        action: () => {

        }
      }
    },
    pasteEvent() {
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

        /* for (var i = 0; i < cbd.items.length; i++) {
          var item = cbd.items[i];
          console.log(item.kind);
          switch (item.kind) {
            case "file":
              var blob = item.getAsFile();
              console.log(blob);
              // blob 就是从剪切板获得的文件 可以进行上传或其他操作
              break;
            case "string":
              item.getAsString((text) => {
                console.log(text);
                return
                app.searchShimo(text);
              })

              break;
          }
        } */
        for (var i = 0, unikind; i < cbd.items.length; i++) {
          var item = cbd.items[i];
          if (!unikind) {
            unikind = item.kind;
          }
          if (i == cbd.items.length - 1) {
            console.log(`${i}项全部都是${unikind}`);
            if (unikind == 'string') {
              /* for (var j = 0; j < cbd.items.length; j++) {
                var item = cbd.items[j];
                console.log(item.kind);
                var k = 0;
                if (j !== 0) {
                  item.getAsString((text) => {
                    console.log(`这是第${k}项目的解析结果:${text}`);
                    k++;
                    return
                    app.searchShimo(text);
                  })
                }
              } */
              cbd.items[0].getAsString((text) => {
                app.keyword = text;
                app.searchShimo(text);
              })
            }
          }

          if (unikind == item.kind) { continue; } else {
            break;
          }
        }


        // e.preventDefault();//这句可以导致粘贴不成功
      }, false);
    },

    hoverOrNot() {
      this.hover = false;
      setTimeout(() => {
        this.hover = true;
      }, 800);
    },

    occurFab() {
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      // console.log(scrollTop);
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
    rightClick(index, e) {
      /*       e.preventDefault()
            console.log(e);
            this.showMenu = false
            this.MenuX = e.clientX
            this.MenuY = e.clientY
            this.$nextTick(() => {
              this.showMenu = true
            }) */

      e.preventDefault()
      // console.log(index);
      this.showMenu = false;
      this.showMenuIndex = index;
      this.MenuX = e.clientX;
      this.MenuY = e.clientY;


      this.$nextTick(() => {
        this.showMenu = true;
      })
      setTimeout(() => {
        this.initClipboardJS();
      }, 0);

    },
    deleteContent: async function (currentVideo) {
      console.log(currentVideo);
      if (currentVideo.id) {
        console.log(currentVideo.attributes.id);
        AV.Cloud.run('deleteContent', {
          id: currentVideo.attributes.id,
        });
        AV.Object.createWithoutData('ShimoBed', currentVideo.id)
          .destroy()
          .then(function () {
            this.mainList.results.splice(this.mainList.results.indexOf(currentVideo), 1)
            this.bottomSheet = false;
          })
          .catch(alert);

      } else {
        console.error("没有石墨评论id号,无法删除!");
      }
    },
    downloadStraightly(uploaderURL) {
      var downloadURL = uploaderURL + '?download';
      // console.log(app.currentVideo.url);
      window.location.href = downloadURL;
    },
    initClipboardJS() {
      //bottomSheet里面的复制按钮初始化

      var btn = document.getElementById('复制短链');
      var clipboard = new ClipboardJS(btn, {
        text: function (trigger) {
          return app.makeNewDic(app.currentVideo).attributes.copyContent;
        }
      });

      clipboard.on('success', function (e) {
        app.copySuccess();
      });

      clipboard.on('error', function (e) {
        console.log(e);
      });

      //more按钮的复制按钮初始化
      var btn = document.getElementsByName('copyBTN')
      if (btn.length == 0) { return }
      var clipboard = new ClipboardJS(btn, {
        text: function (trigger) {
          return trigger.getAttribute('copyContent')
        }

      });

      clipboard.on('success', function (e) {
        // console.log(e);
        app.copySuccess();
      });

      clipboard.on('error', function (e) {
        console.log(e);
      });
    },
    expandPanel() {
      this.arrowDegree += 180;
      this.infoPanel = this.infoPanel ? false : true;
    },
    onResize() {
      // console.log({ x: window.innerWidth, y: window.innerHeight });
      this.mobile = this.isMobile();
    },
    isMobile() {
      let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
      // console.log(flag);
      if (flag) { return true } else { return false }
    },
    keyboardEvent(e) {
      // key.Code === 13表示回车键 
      console.log(e);
      // if (e.keyCode === 13) {
      //   //逻辑处理
      //   this.searchByKeyword({ delay: 0 })
      //   this.$refs.searchBar.blur();
      // }
    },
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

      switch (item.attributes.type) {
        case '视频':
        case '大视频':
          // document.getElementById('dplayer').setAttribute("src", item.shortURL);
          if (this.currentVideo.attributes.name !== item.attributes.name) {//标题跟之前的不同才会切换新视频进行播放

            this.currentVideo = item;
            // this.currentVideo.name = item.name;
            // this.currentVideo.shortURL = item.shortURL;
            // this.currentVideo.name_trans = item.name_trans;

            // this.currentVideo.size = item.size;

            var url = item.attributes.expandedURL ? item.attributes.expandedURL : item.attributes.uploaderURL;

            this.currentVideo.attributes.url = url;
            this.dpFloat.notice(`正在加载:${item.attributes.name}`, 0, 0.8);
            this.dpFloat.switchVideo({
              url: url,
            });
          }


          this.bottomSheet = true;


          this.dpFloat.on('canplaythrough', function () {
            var dp = window.app.dpFloat;
            if (dp.video.currentTime < 1) {
              dp.notice(`成功加载!`, 1000, 0.8);
              dp.play();
            }

          });
          break;
        default:
          return
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
    initPlayers() {
      // dplayer-float
      this.dpFloat = new DPlayer({
        container: document.getElementById('dplayer'),
        preload: 'auto',
        autoplay: false,
        screenshot: true,
        video: {
          url: this.v,
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
    },
    getID() {
      var id = this.getUrlVars().id;
      if (id) {
        let query = new AV.Query('ShimoBed');
        query.get(id).then(function (item) {
          // console.log(item.attributes);
          app.howToPlay(item);
          /*           app.currentVideo.name = item.get('name');
                    app.currentVideo.name_trans = item.get('name_trans');
                    app.currentVideo.size = item.get('size');
                    app.currentVideo.shortURL = item.get('shortURL');
                    app.currentVideo.type = item.get('type');
          
                    var uploaderURL = item.get('uploaderURL');
                    var expandedURL = item.get('expandedURL');
                    var v = expandedURL ? expandedURL : uploaderURL;
                    this.dpFloat.switchVideo({
                      url: v,
                    });
                    app.bottomSheet = true; */
        }, function (error) {
          // 异常处理
          console.error(error);
        });


        return true;
      }
      return false;
    },
    getV() {
      var v = this.getUrlVars().v;
      if (v) {
        console.log('正在加载该视频:' + v);
        this.bottomSheet = true;
        // this.v = v;
        // document.getElementById('dplayer').setAttribute("src", v);
        this.dpFloat.switchVideo({
          url: v,
        });
      }
    },
    getQ() {
      var keyword = this.getUrlVars().q;
      if (!keyword) { return this.keyword = '' }
      else { this.keyword = decodeURIComponent(keyword); this.searchByKeyword(); return }
    },
    submit(e) {
      // key.Code === 13表示回车键 
      // console.log(e);
      if (e.keyCode === 13) {
        //逻辑处理
        this.searchByKeyword({ delay: 0 })
        this.$refs.searchBar.blur();
      }
    },
    getScrollStyle() {

      return this.scrollStyle = `max-height: ${window.innerHeight - 120}px`
    },
    cutHTTP(input) {
      return input.replace(/[a-zA-z]+:\/\//g, '');
    },
    makeEmoji(suffix) {
      var emoji;

      if (suffix.match(/[a-zA-Z]/g)) {
        if (suffix.match(/mp4|mov|avi/ig)) {//根据后缀给出emoji
          emoji = "🎬";//常规视频文件
        } else if (suffix.match(/webm|mkv|avi/ig)) {
          emoji = "▶️";//手机无法播放的非常规视频文件
        } else if (suffix.match(/mp3|ogg|wav|flac|ape|alca|aac/ig)) {
          emoji = "🎵";//音频文件
        } else if (suffix.match(/zip|7z|rar/ig)) {
          emoji = "📦";//压缩包
        } else if (suffix.match(/dmg|iso/ig)) {
          emoji = "💽";//光盘映像
        } else if (suffix.match(/ai|psd|aep/ig)) {
          emoji = "📐";//工程文件
        } else if (suffix.match(/ppt|pptx|key/ig)) {
          emoji = "📽️";//演示文件
        } else if (suffix.match(/ttf|otf/ig)) {
          emoji = "🔤️";//字体文件
        } else if (suffix.match(/doc|pdf/ig)) {
          emoji = "️📄";//文档
        } else {
          emoji = "❓";//未知格式
        }
      } else {
        emoji = suffix;
      }
      return emoji;
    },


    suffixHandle(suffix) {
      suffix = suffix.toLowerCase();
      const fileIndex = {};

      this.fileDescription.forEach((e, index) => {

        e.rule.forEach((type) => fileIndex[type] = this.fileDescription[index])
      });

      if (!fileIndex[suffix]) {
        return {
          emoji: "❓",//未知格式
          type: "未知格式",
        }
      }

      return {
        emoji: fileIndex[suffix].emoji,
        type: fileIndex[suffix].type,
        canPlay: fileIndex[suffix].canPlay,
      };


      // var arr = [
      //   {
      //     regex: /mp4|mov/ig,
      //     emoji: "🎬",//常规视频文件
      //     type: "视频",
      //   },
      //   {
      //     regex: /webm|mkv|avi|flv/ig,
      //     emoji: "▶️",//常规视频文件
      //     type: "大视频",
      //   },
      //   {
      //     regex: /mp3|ogg|wav|flac|ape|alca|aac/ig,
      //     emoji: "🎵",//音频文件
      //     type: "音频",
      //   },
      //   {
      //     regex: /zip|7z|rar/ig,
      //     emoji: "📦",//压缩包
      //     type: "压缩包",
      //   },
      //   {
      //     regex: /dmg|iso/ig,
      //     emoji: "💽",//光盘映像
      //     type: "光盘映像",
      //   },
      //   {
      //     regex: /ai|psd|aep/ig,
      //     emoji: "📐",//工程文件
      //     type: "工程文件",
      //   },
      //   {
      //     regex: /ppt|pptx|key/ig,
      //     emoji: "📽️",//演示文件
      //     type: "演示文件",
      //   },
      //   {
      //     regex: /ttf|otf/ig,
      //     emoji: "🔤️",//字体文件
      //     type: "字体",
      //   },
      //   {
      //     regex: /doc|pdf|txt/ig,
      //     emoji: "️📄",//文档
      //     type: "文档",
      //   },
      //   {
      //     regex: /.*/ig,
      //     emoji: "❓",//未知格式
      //     type: "未知格式",
      //   }
      // ];


      // for (var i = 0; i < arr.length; i++) {
      //   if (suffix.match(arr[i].regex)) {
      //     return {
      //       emoji: arr[i].emoji,
      //       type: arr[i].type,
      //     };
      //   };
      // }


      // if (suffix.match(/[a-zA-Z]/g)) {
      //   if (suffix.match(/mp4|mov/ig)) {//根据后缀给出emoji
      //     regex = /mp4|mov/ig;
      //     emoji = "🎬";//常规视频文件
      //     type = "视频";
      //   } else if (suffix.match(/webm|mkv|avi|flv/ig)) {
      //     regex = /webm|mkv|avi|flv/ig;
      //     emoji = "▶️";//手机无法播放的非常规视频文件
      //     type = "大视频";
      //   } else if (suffix.match(/mp3|ogg|wav|flac|ape|alca|aac/ig)) {
      //     regex = /mp3|ogg|wav|flac|ape|alca|aac/ig;
      //     emoji = "🎵";//音频文件
      //     type = "音频";
      //   } else if (suffix.match(/zip|7z|rar/ig)) {
      //     regex = /zip|7z|rar/ig;
      //     emoji = "📦";//压缩包
      //     type = "压缩包";
      //   } else if (suffix.match(/dmg|iso/ig)) {
      //     regex = /dmg|iso/ig;
      //     emoji = "💽";//光盘映像
      //     type = "光盘映像";
      //   } else if (suffix.match(/ai|psd|aep/ig)) {
      //     regex = /ai|psd|aep/ig;
      //     emoji = "📐";//工程文件
      //     type = "工程文件";
      //   } else if (suffix.match(/ppt|pptx|key/ig)) {
      //     regex = /ppt|pptx|key/ig;
      //     emoji = "📽️";//演示文件
      //     type = "演示文件";
      //   } else if (suffix.match(/ttf|otf/ig)) {
      //     regex = /ttf|otf/ig;
      //     emoji = "🔤️";//字体文件
      //     type = "字体";
      //   } else if (suffix.match(/doc|pdf|txt/ig)) {
      //     regex = /doc|pdf|txt/ig;
      //     emoji = "️📄";//文档
      //     type = "文档";
      //   } else {
      //     regex = /.*/ig;
      //     emoji = "❓";//未知格式
      //     type = "未知格式";
      //   }
      // } else {
      //   emoji = suffix;

      // }


    },
    makeNewDic(e) {

      if (!e.id) { return }

      var dic = e.attributes;

      e.attributes.suffix = dic.type;//后缀

      var handle = app.suffixHandle(dic.type);

      var emoji = handle.emoji;

      e.attributes.type = handle.type;

      e.attributes.canPlay = handle.canPlay;

      var name = dic.name;

      var shortURL = app.cutHTTP(dic.shortURL);

      var copyContent = `${emoji} ${name} | ${shortURL}`;

      e.attributes.copyContent = copyContent;

      e.attributes.content = emoji + name;//在vue的todo里面content代表

      return e;
    },
    makeAList(resp) {
      var result = [];


      app.typeList = [
        {
          size: '20', icon: 'fas fa-globe-americas', text: '全部', count: 0,
        },
      ];

      const fileIndex = {};

      this.fileDescription.forEach((e, index) => {
        fileIndex[e.type] = { count: 0, subClassArr: [], icon: e.icon, size: e.size };
      });



      resp.forEach(e => {
        var newDic = app.makeNewDic(e);

        fileIndex[newDic.attributes.type].count++;
        fileIndex[newDic.attributes.type].subClassArr.push(newDic);
        app.typeList[0].count++;//也就是'全部'
        result.push(newDic);
      });

      app.typeList[0].subClassArr = result;//全部的subClassArr

      this.fileDescription.forEach((e, index) => {
        var subClass = fileIndex[e.type];
        app.typeList.push({
          text: e.type,
          count: subClass.count,
          icon: subClass.icon,
          size: subClass.size,
          subClassArr: subClass.subClassArr,
        })

      });


      return result;
    }
    ,
    searchLC: async function (key) {
      var query = new AV.SearchQuery('ShimoBed');//class名
      query.queryString(key);//要搜索的关键词
      var resp = await query.find();
      // console.info(resp);
      //    console.log("找到了 " + query.hits() + " 个文件.");
      return app.makeAList(resp);
    },

    searchShimo: async function (key) {
      var startTime = new Date();
      var results = "";

      var matchedURL = key.match(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/gm);
      if (matchedURL) {
        console.log('即将执行webClipper');
        app.loadingDialog = {
          model: true,
          text: '正在摘抄您指定的URL'
        };
        matchedURL.forEach(e => {
          AV.Cloud.run('webClipper', {
            url: e,
          }).then(function (data) {
            // 成功
            console.log(data);
            app.loadingDialog.model = false;
            app.snackbar.show = false;
            app.snackbar = {
              show: true,
              color: 'success',
              ripple: false,
              snackbarText: `文章已保存到石墨上`,
              snackbarIcon: 'mdi-content-save',
              actionText: '点击查看',
              action: () => {
                window.open(data.docURL);
              }
            };
          }, function (error) {
            // 失败
            console.log(error);
          });
        })
        return
      }

      if (!key) {
        var data = await AV.Cloud.run('updateShimo');
        console.log(data);

        if (data > 0) {
          app.snackbar.show = false;
          app.snackbar = {
            show: true,
            color: 'success',
            ripple: false,
            snackbarText: `新增${data}条记录`,
            snackbarIcon: 'mdi-sync',
            action: () => {

            }
          };
        } else {
          this.showTop20();

        }

        var query = new AV.Query('ShimoBed');
        query.descending("updatedAt");
        query.limit(20);//请求数量上限为1000条
        var every = await query.find();

        console.log(every);

        results = app.makeAList(every);
        // console.log(results);
      } else {

        var results = await app.searchLC(key);
        // alert(JSON.stringify(this.todos[0]));
        if (results == "") {

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
          app.snackbar.show = false;
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
      // console.log(app.mainList.results);

      app.mainList.results = results;

      var endTime = new Date();
      app.searchDuration = (endTime - startTime) / 1000;//毫秒转成秒

      setTimeout(() => {
        this.initClipboardJS();
      }, 0)
    },
    showLoading(target) {
      target.custom = false;
      target.searchLoading = true;
      setTimeout(() => {
        target.custom = true;
        target.searchLoading = false;
      }, 2000)
    },
    searchDelay(target, delay) {

      target.lastTime = setTimeout(() => {
        var key = target.keyword;
        this.showLoading(target);
        // window.location.href = `?q=${key}`
        // console.log('关键词为:' + key);
        // bingDic(key);
        app.searchShimo(key);
      }, delay)
    },
    searchByKeyword(request) {
      var delay = request ? request.delay : 0;
      var target = this;
      if (target.keywordLasttime != target.keyword) {
        target.mainList.results = [];
        target.keywordLasttime = '';
        if (target.lastTime == 0) {
          this.searchDelay(target, delay);
        } else {
          clearTimeout(target.lastTime);
          this.searchDelay(target, delay);
        }
      }
    },
    getUrlVars() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = decodeURI(value);
      });
      return vars;
    },
    showTop20() {
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



  },

})


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











//以下是新增的Dplayer播放窗口组件







// var log = function (content) {
//   if (!output.innerHTML) {
//     output.innerHTML = content;
//   } else {
//     output.innerHTML += '<br>' + content;
//   }
//   output.scrollTop = 99999;
// };

// var pipWindow, currentVideo;

// currentVideo = dplayer.getElementsByTagName('video')[0];
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

this.dpFloat.fullScreen.request('web');//全屏观看 */




$(".dplayer-menu-item:contains('关于作者')").remove();//移除关于作者的右键按钮
$(".dplayer-menu-item:contains('DPlayer v1.25.0')").remove();//移除DPlayer版本号的右键按钮


