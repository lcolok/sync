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

    maxItemsPerPage: 20,
    hasLoadedPages: 0,

    dropAndUploadDialog: {
      model: true,
      show: false
    },
    saveDesktopIconDialog: false,
    moreBottomSheet: false,

    progressDialog: {
      model: false,
      percent: 0,
    },
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
        rule: ["png", "jpg", "bmp", "gif"],
        emoji: "🖼️",//图片
        type: "图片",
        size: '',
        icon: 'mdi-file-image',
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
    fab: true,
    fling: false,
    hover: true,
    tabs: null,
    top: false,
    right: true,
    bottom: true,
    left: false,
    transition: 'scale-transition',
    windowSize: {},

    floatBTN_Occur: 0,
    floatBTN: {
      fabs: [
        {
          icon: 'keyboard_arrow_up',
          small: true,
          color: 'orange',
          action() {
            app.$vuetify.goTo(0);
          }
        },
        {
          icon: 'mdi-cloud-upload',
          small: true,
          color: 'indigo',
          name: 'upload',
          action() {
            app.dropAndUploadDialog.show = true;
          }
        },
        {
          icon: 'search',
          small: true,
          color: 'green',
          action() {
            app.hoverOrNot();
            app.$refs.searchBar.focus();
          }
        },
      ]
    },

    originalName: '',
    renameInput: '',
    showMenuIndex: 'init',
    MenuX: 0,
    MenuY: 0,
    showMenu: false,
    renameDialog: false,
    deleteConfirmDialog: false,
    copyBtn: null, //存储初始化复制按钮事件
    mobile: null,
    infoPanel: false,
    videoHeight: 0,
    videoWidth: 0,

    browserDialog: false,
    browserChoice: 'Chrome',
    browsers: [
      {
        name: 'Chrome',
        color: '',
        icon: 'mdi-google-chrome',

      },
      {
        name: 'Safari',
        color: '',
        icon: 'mdi-apple-safari',
      },
      {
        name: 'Firefox',
        color: '',
        icon: 'mdi-firefox',
      }
    ],

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
        icon: 'mdi-rename-box', text: '重命名', showInSheet: true, action: (renameOjbect, event) => {
          app.originalName = renameOjbect.attributes.name;
          app.renameOjbect = renameOjbect;
          console.log(event);
          app.renameInput = renameOjbect.get('name');
          app.renameDialog = true;
          setTimeout(() => {
            app.$refs.renameInput.focus();

          }, 0)
        }
      },
      {
        icon: 'mdi-comment-plus', text: '备注', action: () => {

        }
      },
      {
        icon: 'mdi-link-box-variant-outline', text: '纯短链', name: 'copyShortURL', action: () => {

        }
      },
      {
        icon: 'mdi-link-variant', text: '纯长链', name: 'copyLongURL', action: () => {

        }
      },
      /*       {
              icon: 'mdi-egg-easter', text: '获取ID', name: 'getID', action: () => {
      
              }
            }, */
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
        icon: 'mdi-file-upload', text: '石墨文档上传', tip: '将会打开石墨的页面进行上传(需要购买会员才能上传10M以上的文件)', action: () => {
          window.open('https://shimo.im/docs/K8CWmBMqMtYYpU1f');
        }
      },
      {
        icon: 'mdi-cloud-upload', text: '上传页面', tip: '将会打开一个反向代理的上传页(100M以内的文件应该都无压力的)', action: () => {
          window.open((window.location.href + 'uploadPage'));
        }
      },
      {
        icon: 'mdi-database-edit', text: '数据管理', action: () => {
          window.open('https://leancloud.cn/dashboard/data.html?appid=Km0N0lCryHeME8pYGOpOLag5-gzGzoHsz#/ShimoBed')
        }
      },
      {
        icon: 'mdi-share', text: '分享网址', name: 'shareThisApp', action: () => {

        }
      },
      {
        icon: 'mdi-apple-safari', text: '桌面图标',
        hide: () => {//填写隐藏规则
          return !window.navigator.standalone//检测是否全屏(是否在PWA状态下打开)
        },
        action: () => {
          // window.location.href='mqqapi://';//打开QQ
          // var encodedURL = encodeURIComponent("https://www.baidu.com");
          // window.location.href = `x-web-search://?${encodedURL}`
          app.browserDialog = true;
          // window.location.href = 'addIcon/saveAsSafari.html';
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
    resultSumLasttime: null,
    typeList: [/* 

      {
        size: '20', icon: 'fas fa-globe-americas', text: '全部'
      },
      { size: '', icon: 'mdi-movie', text: '视频' },
      { size: '', icon: 'mdi-music', text: '音乐' },
      { size: '', icon: 'mdi-image-area', text: '图片' },
      { size: '', icon: 'mdi-file-pdf', text: 'PDF' },
      { size: '20', icon: 'fas fa-file-archive fa-xs', text: '压缩包' },

     */],
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
    tempPlayingID: '',
    primaryDrawer: {
      model: false,//决定一开始是展开状态还是折叠状态
      type: 'default (no property)',
      clipped: false,
      floating: false,
      mini: false,

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
    layoutAttributes() {
      var BPN = this.$vuetify.breakpoint.name;
      console.log(BPN);
      switch (BPN) {
        case 'xs':
          return { 'justify-space-between': true };
        default:
          return { 'jusetify-begin': true };
      }
    },
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
    this.shimoData = AV.Cloud.run('updateShimo');

  },
  mounted() {
    if (this.user) {

      this.getScrollStyle();
      this.initPlayers();
      this.initPasteEvent();
      this.initFilePond();
      this.initDropFiled();
      this.initMiniRefresh();
      //处理Params
      // this.getQ() ? 0 : (this.getV() ? 0 : (this.getID() ? 0 : this.searchGlobal('')))
      var param = this.getUrlVars();
      if (param !== {}) {
        if (param.q) { return this.getQ(param.q) };
        if (param.v) { return this.getV(param.v) };
        if (param.id) { return this.getID(param.id) };
        if (param.b && (!window.navigator.standalone)) { return this.getB(param.b) };//检测是否带b参数,并且是否在全屏状态下(是否在PWA状态下打开)
      }

      if (this.searchGlobal('')) { return };

    }
  },
  watch: {
    typeList(val) {
      this.typeListSorted = val.slice().sort((a, b) => {
        return b.count - a.count
      });
    },
    renameDialog(val) {
      if (val) {
        app.removePasteEvent();
      } else {
        app.initPasteEvent();
      }
    },
    'primaryDrawer.model'(val) {
      if (val) return;
      if (!tempPlayingID) return;

      this.getID(tempPlayingID);
    },
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
    /*     screenSizeStatus() {
          console.log(this.$vuetify.breakpoint.name);
          switch (this.$vuetify.breakpoint.name) {
            case 'xs': return '220px';
            case 'sm': return '400px';
            case 'md': return '500px';
            case 'lg': return '600px';
            case 'xl': return '800px';
          }
        }, */
    initMiniRefresh() {
      var miniRefresh = new MiniRefresh({
        container: '#minirefresh',
        down: {
          // isAuto: true,
          callback: async function () {
            // 下拉事件 刷新
            console.log('正在下拉');
            // window.location.reload();//页面刷新
            await app.regularCheckUpdate();
            miniRefresh.endDownLoading();
          }
        },
        up: {

          callback: function () {
            // 上拉事件
            console.log('正在上拉');
            miniRefresh.endUpLoading(true);
          }
        }
      });
    },
    pasteToSearchBar(event) {
      /*       var pasteText = document.getElementById("searchBar");
            pasteText.focus();
            document.execCommand("paste");
            console.log(pasteText.textContent); */
      var clipboardData = event.clipboardData || window.clipboardData;
      return clipboardData.getData("text");
    }
    ,
    initDropFiled() {
      //拖拽的目标节点
      var dropZone = document.getElementById('app');


      function showDropZone() {
        console.log("visible");
        app.dropAndUploadDialog.show = true;

        // dropZone.style.visibility = "visible";
      }
      function hideDropZone() {
        console.log("hidden");
        app.dropAndUploadDialog.show = false;
        // dropZone.style.visibility = "hidden";
      }

      function allowDrag(e) {
        if (true) {
          // Test that the item being dragged is a valid one
          e.dataTransfer.dropEffect = 'copy';
          e.preventDefault();
        }
      }

      function handleDrop(e) {
        if (app.timerCloseDialog) { clearTimeout(app.timerCloseDialog); }
        e.preventDefault();

        // hideDropZone();

        console.log(e);
      }

      // 监听widow上的事件
      window.addEventListener('dragenter', function (e) {
        showDropZone();
      });

      dropZone.addEventListener('dragenter', allowDrag);
      dropZone.addEventListener('dragover', allowDrag);

      dropZone.addEventListener('dragover', () => {
        if (app.timerCloseDialog) { clearTimeout(app.timerCloseDialog); }
        app.timerCloseDialog = setTimeout(() => {
          hideDropZone();
        }, 500)
      });

      // dropZone.addEventListener('dragleave', hideDropZone);

      // document.getElementById('filepond').addEventListener('dragleave', hideDropZone);

      dropZone.addEventListener('drop', handleDrop);
    },
    initFilePond() {
      const inputElement = document.querySelector('input[type="file"]');
      const inputElement2 = document.getElementById('filepond2');

      FilePond.registerPlugin(
        FilePondPluginImagePreview,
        FilePondPluginImageExifOrientation,
        // FilePondPluginFilePoster
      );

      console.log(inputElement);

      // create a FilePond instance at the input element location
      const pond = FilePond.create(inputElement, {
        server: {
          process: async (
            fieldName,
            file,
            metadata,
            load,
            error,
            progress,
            abort
          ) => {
            console.log(file);

            var QJ = await AV.Cloud.run("getQiniuJSON", {
              fileNameArr: [file.name]
            });

            console.log(QJ);

            var observer = {
              next(res) {
                var e = res.total;
                console.log(e);
                progress(true, e.loaded, e.size);
              },
              error(err) {
                console.error(err);
                error(err);
              },
              complete(res) {
                console.log(res);
                if (res.code == 0) {

      
                  var json = res;
                  console.log(json);
                  var filename = file.name;

                  var arr = filename.split('.');
                  var suffix = arr.pop();
                  var realName = arr.join('.');

                  json.data.suffix = suffix;
                  json.data.name = realName;

                  AV.Cloud.run('updateShimo', json);

                  load(res); //完成后，应该用文件对象或blob调用load方法 load方法接受字符串(id)或对象
                }

              }
            };

            var putExtra = {
              fname: "", //fname: string，文件原文件名
              params: {}, //params: object，用来放置自定义变量
              mimeType: null //mimeType: null || array，用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里：["image/png", "image/jpeg", "image/gif"]
            };

            var config = {
              // useCdnDomain: true,//表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。（感觉开启了之后，上传的速度更慢了）
              concurrentRequestLimit: 9 //分片上传的并发请求量，number，默认为3；因为浏览器本身也会限制最大并发量，所以最大并发量与浏览器有关。
            };

            var observable = qiniu.upload(
              file,
              QJ[0].key,
              QJ[0].token,
              putExtra,
              config
            );
            var subscription = observable.subscribe(observer); // 上传开始
            // or
            //   var subscription = observable.subscribe(next, error, complete); // 这样传参形式也可以

            return {
              abort: () => {
                // 如果用户点击了取消按钮，则进入该功能
                subscription.unsubscribe(); // 上传取消

                //让filepond知道请求已被取消
                abort();
              }
            };
          }
        },
        dropOnPage: true,

        //以下为本地化
        labelIdle: '拖放文件于此或者<span class="filepond--label-action"> 浏览本地 </span>',
        labelInvalidField: '字段包含无效文件',
        labelFileWaitingForSize: '正在计算大小',
        labelFileSizeNotAvailable: '未知大小',
        labelFileLoading: '载入中',
        labelFileLoadError: '加载出错',
        labelFileProcessing: '上传中',
        labelFileProcessingComplete: '上传完成',
        labelFileProcessingAborted: '上传已取消',
        labelFileProcessingError: '上传时出错',
        labelFileProcessingRevertError: '还原时出错',
        labelFileRemoveError: '删除时出错',
        labelTapToCancel: '点击取消',
        labelTapToRetry: '点击重试',
        labelTapToUndo: '点击撤回',
        labelButtonRemoveItem: '移除',
        labelButtonAbortItemLoad: '中止',
        labelButtonRetryItemLoad: '重试',
        labelButtonAbortItemProcessing: '取消',
        labelButtonUndoItemProcessing: '撤回',
        labelButtonRetryItemProcessing: '重试',
        labelButtonProcessItem: '上传',
      });
    },

    isMobileSafari() {
      var ua = navigator.userAgent;

      // IOS系统
      if (/ OS \d/.test(ua)) {
        // 不是Chrome
        if (!~ua.indexOf('CriOS')) {
          // 开头必须为Mozilla
          if (!ua.indexOf('Mozilla')) {
            // 结尾需为：Safari/xxx.xx
            if (/Safari\/[\d\.]+$/.test(ua)) {
              return true;
            }
          }
        }
      }
      return false;
    },
    saveDesktopIcon(browser) {
      browser = browser.toLowerCase();
      if (browser == 'safari' && this.isMobileSafari()) {
        this.browserDialog = false;
        this.saveDesktopIconDialog = true;
        return
      }
      window.location.href = `addIcon/?browser=${browser}`;
      return
    },
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
    copySuccess(e) {
      /* app.snackbar.show = false;

      app.snackbar = {
        show: true,
        color: 'success',
        ripple: false,
        snackbarText: '已复制',
        snackbarIcon: 'file_copy',
        action: () => {

        }
      } */
      e = e ? e : '已复制'
      app.$message.success(e);
      sfx.play('https://uploader.shimo.im/f/YOwjiyzl4Kk0Dd5H.mp3?attname=Paste_Copy.mp3');
    },


    pasteEventHandler(e) {
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
              app.searchGlobal(text);
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
                  app.searchGlobal(text);
                })
              }
            } */
            cbd.items[0].getAsString((text) => {
              app.searchGlobal(text);
            })
          }
        }

        if (unikind == item.kind) { continue; } else {
          break;
        }
      }


      // e.preventDefault();//这句可以导致粘贴不成功

    }
    ,
    initPasteEvent() {
      document.addEventListener("paste", this.pasteEventHandler, false);//初始化paste事件监听
    },
    removePasteEvent() {
      document.removeEventListener("paste", this.pasteEventHandler, false);//移除粘贴事件的监听
    },
    hoverOrNot() {
      this.hover = false;
      setTimeout(() => {
        this.hover = true;
      }, 800);
    },
    loadMoreItems: async function () {
      var realThis = this;
      return new Promise(async function (resolve, reject) {
        var query = new AV.Query('ShimoBed');
        query.descending("updatedAt");
        query.limit(realThis.maxItemsPerPage * (realThis.hasLoadedPages + 1));//请求数量上限为1000条
        var every = await query.find();
        console.log(every);
        app.mainList.results = app.makeAList(every);
        if (every) {
          resolve(every);
        } else {
          reject("没有返回结果");
        }
      });
    },
    autoLoad() {
      if (app.keywordLasttime) { return }

      //变量scrollTop是滚动条滚动时，距离顶部的距离
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset;
      //变量windowHeight是可视区的高度
      var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      //变量scrollHeight是滚动条的总高度
      var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      //滚动条到底部的条件
      var offset = 200;
      if ((scrollTop + windowHeight + offset >= scrollHeight) && !this.loadingItems) {//如果已经进行过搜索的话,就不会进行自动加载
        //写后台加载数据的函数
        // console.log("距顶部" + scrollTop + "可视区高度" + windowHeight + "滚动条总高度" + scrollHeight);
        app.loadingDialog = {
          model: true,
          text: '正在加载更多项目...'
        };

        this.loadingItems = true;
        this.hasLoadedPages++;
        this.loadMoreItems().then(() => {
          this.loadingItems = false;
          app.loadingDialog.model = false;
        });
      }
    },

    occurFab() {
      var scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
      /*       console.log(`已经滚动：${scrollTop}`);
            console.log(`窗口高度：${window.innerHeight}`);
            console.log(`两者之差：${window.innerHeight - scrollTop}`); */
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
      // e.preventDefault()
      // console.log(e);
      // this.showMenu = false
      // this.MenuX = e.clientX
      // this.MenuY = e.clientY
      // this.$nextTick(() => {
      //   this.showMenu = true
      // })

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
    focusOrNot(event) {
      if (app.originalName !== app.renameInput) {
        event.target.select();
        app.originalName = app.renameInput;
      }

    },
    renameContent: async function (currentVideo) {
      if (app.renameInput !== app.originalName) {
        var renameObject = AV.Object.createWithoutData('ShimoBed', currentVideo.id);
        renameObject.set('name', app.renameInput);
        renameObject.save().then(function (renameObject) {
          currentVideo.attributes.name = app.renameInput;//刷新在屏幕上显示的名称
          app.$message.success(`「${app.originalName}」已重命名为「${app.renameInput}」`);
          // 成功保存之后，执行其他逻辑.
        }).catch((err) => {
          app.$message.error(`发生错误:${err}`);
        })
        return
      }
      console.log('名字没有更改');
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

            app.mainList.results.splice(app.mainList.results.indexOf(currentVideo), 1)
            app.bottomSheet = false;
          })
          .catch((err) => { console.log(err); });

      } else {
        console.error("没有石墨评论id号,无法删除!");
      }
    },
    downloadStraightly(uploaderURL) {
      var downloadURL = uploaderURL + '?download';
      // console.log(app.currentVideo.url);
      window.location.href = downloadURL;
    },

    renameDownload(url, filename) {


      function updateProgress(evt) {
        if (evt.lengthComputable) {  //evt.loaded the bytes browser receive
          //evt.total the total bytes seted by the header
          //
          var percentComplete = (evt.loaded / evt.total) * 100;

          var density = 5;//进度条运动密度
          app.progressDialog.percent = Math.floor(percentComplete / density) * density;
          // console.log(app.progressDialog.percent);
          // $('#progressbar').progressbar("option", "value", percentComplete);
        }
      }



      /**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise} 
 */
      function getBlob(url) {
        return new Promise(resolve => {
          const xhr = new XMLHttpRequest();

          xhr.onprogress = updateProgress;
          xhr.open('GET', url, true);
          xhr.responseType = 'blob';
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.response);
            }
          };

          xhr.send();
        });
      }

      /**
      * 保存
      * @param  {Blob} blob     
      * @param  {String} filename 想要保存的文件名称
      */
      function saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement('a');
          const body = document.querySelector('body');

          link.href = window.URL.createObjectURL(blob);
          link.download = filename;

          // fix Firefox
          link.style.display = 'none';
          body.appendChild(link);

          link.click();
          body.removeChild(link);

          window.URL.revokeObjectURL(link.href);
        }
      }

      /**
      * 下载
      * @param  {String} url 目标文件地址
      * @param  {String} filename 想要保存的文件名称
      */
      function download(url, filename, finishedCallBack) {
        app.progressDialog.filename = filename;
        app.progressDialog.model = true;//进度条出现



        getBlob(url).then(blob => {
          finishedCallBack(blob);
          setTimeout(() => { app.progressDialog.model = false; }, 1500)//进度条消失
          saveAs(blob, filename);
        });
      }

      download(url, filename, blob => {
        //完成后会执行的
        app.$message.success(`已完成下载`);
      });
    }
    ,
    initClipboardJS() {

      /*       [
              app.shareThisAppCopyBTN,
              app.bottomSheetCopyBTN,
              app.moreCopyBTN,
              app.bottomSheetIdCopyBTN,
              app.moreIdCopyBTN
            ].forEach(e => {
              e ? e.destroy() : null
            })
       */

      /* var arr = [];
      for (var i in app) {
        arr.push(app[i]);
      }
      console.log(arr); */

      //分享当前网址的复制按钮初始化
      function init(name, params) {
        var CBN = 'ClipboardBTN_' + name;
        app[CBN] ? app[CBN].destroy() : null
        app[CBN] = new ClipboardJS(document.getElementsByName(name), {
          text: function (trigger) {
            return params.text(trigger);
          }
        }).on('success', function (e) {
          app.copySuccess(params.message ? params.message : '已复制');
        }).on('error', function (e) {
          console.error(e);
          app.$message.error(e);
        })
      }

      init('shareThisApp', {
        text: () => window.location.href,
        message: '已复制本网站地址,请分享给好友吧'
      });

      init('copyBTN', {
        text: e => e.getAttribute('copyContent') || app.currentVideo.attributes.copyContent,
        message: '已复制短链分享组合'
      });

      init('getID', {
        text: e => e.getAttribute('objectID') || app.currentVideo.id,
        message: '已复制本项目的ID号'
      });

      init('copyLongURL', {
        text: e => e.getAttribute('copyLongURL') || app.currentVideo.attributes.url,
        message: '已复制纯长链'
      });

      init('copyShortURL', {
        text: e => e.getAttribute('copyShortURL') || app.currentVideo.attributes.shortURL,
        message: '已复制纯短链'
      });

      /*  //more按钮的复制按钮初始化
       app.moreCopyBTN = new ClipboardJS(document.getElementsByName('copyBTN'), {
         text: function (trigger) {
           return trigger.getAttribute('copyContent') || app.currentVideo.attributes.copyContent
         } 
 
       }).on('success', function (e) {
         // console.log(e);
         app.copySuccess();
       }).on('error', function (e) {
         console.log(e);
       });
       */

      /* //more按钮的获取ID的复制按钮初始化
      app.moreIdCopyBTN = new ClipboardJS(document.getElementsByName('getID'), {
        text: function (trigger) {
          // console.log(trigger);
          // console.log(trigger.getAttribute('objectID'));
          return trigger.getAttribute('objectID') || app.currentVideo.id;
        }

      }).on('success', function (e) {
        // console.log(e);
        app.copySuccess();
      }).on('error', function (e) {
        console.log(e);
      }); */

      //bottomSheet里面的复制按钮初始化
      /*       app.bottomSheetCopyBTN = new ClipboardJS(document.getElementById('复制短链'), {
              text: function (trigger) {
                // return app.makeNewDic(app.currentVideo).attributes.copyContent;
                return app.currentVideo.attributes.copyContent;
      
              }
            }).on('success', function (e) {
              app.copySuccess();
            }).on('error', function (e) {
              console.log(e);
            }); */

      //bottomSheet里面的获取ID的复制按钮初始化
      /*       app.bottomSheetIdCopyBTN = new ClipboardJS(document.getElementById('获取ID'), {
              text: function (trigger) {
                return app.currentVideo.id;
              }
            }).on('success', function (e) {
              app.copySuccess();
            }).on('error', function (e) {
              console.log(e);
            });
       */
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
            // console.log(item);
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
          /* app.snackbar.show = false;
          app.snackbar = {
            show: true,
            color: 'error',
            ripple: false,
            snackbarText: `暂不支持『${item.attributes.type}』的预览`,
            snackbarIcon: 'report_problem',
            action: () => {
            }
          } */
          app.$message.error(`暂不支持『${item.attributes.type}』的预览`);
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
    getID(id) {
      id = id ? id : this.getUrlVars().id;

      if (id) {
        let query = new AV.Query('ShimoBed');
        query.get(id).then(function (item) {

          var newDic = app.makeNewDic(item);
          // console.log(newDic);

          app.howToPlay(newDic);
          app.initClipboardJS();
        }, function (error) {
          // 异常处理
          console.error(error);
        });


        return true;
      } else {
        return false;
      }
    },
    getV(param) {
      var v = param ? param : this.getUrlVars().v;
      if (v) {
        console.log('正在加载该视频:' + v);
        this.bottomSheet = true;
        // this.v = v;
        // document.getElementById('dplayer').setAttribute("src", v);
        this.dpFloat.switchVideo({
          url: v,
        });
        return true
      } else {
        return false
      }
    },
    getB(param) {
      var browser = param ? param : this.getUrlVars().b;
      if (browser && !window.navigator.standalone) {
        this.saveDesktopIcon(browser);
      }
    },
    getQ(param) {
      var keyword = param ? param : this.getUrlVars().q;
      if (!keyword) {
        this.keyword = '';
        return false
      }
      else {
        this.keyword = decodeURIComponent(keyword);
        this.searchByKeyword();
        return true
      }
    },
    submit(e) {
      // key.Code === 13表示回车键 
      console.log(e);
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
      // return input.replace(/[a-zA-z]+:\/\//g, '');
      return input;
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

      e.attributes.suffix = dic.suffix;//后缀

      // console.log(dic.suffix);

      var handle = app.suffixHandle(dic.suffix);

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
    regularCheckUpdate: async function () {

      const data = this.shimoData;
      console.log(`updateShimo返回结果：${this.shimoData}`);

      if (data > 0) {
        /* app.snackbar.show = false;
        app.snackbar = {
          show: true,
          color: 'success',
          ripple: false,
          snackbarText: `新增${data}条记录`,
          snackbarIcon: 'mdi-sync',
          action: () => {
    
          }
        }; */
        app.$message.success(`新增${data}条记录`);
      } else {
        this.showTop20();

      }

      var query = new AV.Query('ShimoBed');
      query.descending("updatedAt");
      query.limit(this.maxItemsPerPage * (this.hasLoadedPages + 1));//请求数量上限为1000条
      var every = await query.find();

      console.log(every);

      return app.makeAList(every);
      // console.log(results);
    },

    webClipper(matchedURL) {
      console.log('即将执行webClipper');
      app.loadingDialog = {
        model: true,
        text: '正在摘抄您指定的URL'
      };

      AV.Cloud.run('webClipper', {
        url: matchedURL,
      }).then(function (data) {
        // 成功
        console.log(data);
        app.loadingDialog.model = false;
        /* app.snackbar.show = false;
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
        }; */
        // app.$message.success(`文章已保存到石墨上`);
        const key = `open${Date.now()}`;
        app.$notification.open({
          message: `文章已保存到石墨上`,
          description: `标题:${data.title}`,

          style: {
            width: `${358}px`,
          },
          btn: (h) => {
            return h('a-button', {
              props: {
                type: 'primary',
                size: 'small',
              },
              on: {
                click: () => {
                  app.$notification.close(key);
                  window.open(data.docURL);
                }
              }
            }, '点击查看')
          },
          key,
          onClose: close,
        });
      }, function (error) {
        // 失败
        console.log(error);
      });


    }
    ,
    searchGlobal: async function (key) {
      var startTime = new Date();
      var results;

      //如果不存在搜索关键词的话,就直接进行常规加载(也就是加载最近20个项目)
      if (!key) {
        results = await this.regularCheckUpdate();
      } else {
        //如果识别为网址的话 正则
        var matchedURLs = key.match(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/gm);
        if (matchedURLs) {
          matchedURLs.forEach(eachURL => {
            //尝试识别是不是58pic的网址,并读取其ID号
            var qiantuURLs = eachURL.match(/((www\.58pic\.com\/newpic\/))([0-9]{8})(\.html)/gm);

            if (qiantuURLs) {
              qiantuURLs.forEach(e => {
                var qiantuID = e.match(/([0-9]{8})/)[0];
                console.log(qiantuID);
                var downloadURL = `http://cdn.52picc.com/qiantu/${qiantuID}.zip?e=1553441694&token=YsxlOcIuU76uwayGqcefhCHsE3FGs14Vv-ePdvBZ:-3V0KLZqtVO3zUhvjYYnZbr2vns=`;
                AV.Cloud.run('getWebTitle',
                  {
                    url: eachURL,
                  }
                ).then(data => {
                  // 成功
                  console.log(data.qiantuTitle);
                  app.$message.success(`将唤起下载千图网素材「${data.qiantuTitle}」`);
                  app.renameDownload(downloadURL, `${data.qiantuTitle}.zip`);
                }).catch(err => {
                  // 失败
                  console.log(err);
                })

                // window.location.href = `http://cdn.52picc.com/qiantu/${qiantuID}.zip?e=1553441694&token=YsxlOcIuU76uwayGqcefhCHsE3FGs14Vv-ePdvBZ:-3V0KLZqtVO3zUhvjYYnZbr2vns=` 

              })
              return
            }


            //不符合以上正则检测,最终则会进行网页剪藏
            app.webClipper(eachURL);
          })

          return
        }

        //如果识别为objectID的话
        var objectID = key.match(/[0-9a-zA-Z]{24}/gm);
        if (objectID) {
          this.getID(objectID);
          return
        }

        app.keyword = key;
        results = await app.searchLC(key);

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

          /* app.snackbar.show = false;
          app.snackbar = {
            show: true,
            color: 'error',
            ripple: false,
            snackbarText: `找不到关于“${key}”的项目`,
            snackbarIcon: 'report_problem',
            action: () => {
            }
          } */
          app.$message.error(`找不到关于“${key}”的项目`);
          return
        }

        app.keywordLasttime = key;
      }



      app.resultSumLasttime = results.length;

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
        app.searchGlobal(key);
      }, delay)
    },
    searchByKeyword(request) {
      var delay = request ? request.delay : 0;
      var target = this;
      if (target.keywordLasttime != target.keyword) {
        target.mainList.results = [];
        // target.keywordLasttime = '';
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
      /*       app.snackbar = {
              show: true,
              color: 'info',
              ripple: false,
              snackbarText: '已为你搜索最近20条项目',
              snackbarIcon: 'update',
              action: () => {
      
              }
            } */
      const timer = setInterval(() => {
        if (app.$message) {
          app.$message.success('已为你搜索最近20条项目');
          clearInterval(timer);
        }
      }, 100);
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


