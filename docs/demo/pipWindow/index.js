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
        autoplay: true,
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
/* 特征检测 */
if ('pictureInPictureEnabled' in document == false) {
    log('当前浏览器不支持视频画中画。');
    togglePipButton.disabled = true;
}


console.log($(".dplayer-menu-item:contains('关于作者')").remove());//移除关于作者的右键按钮
console.log($(".dplayer-menu-item:contains('DPlayer v1.25.0')").remove());//移除DPlayer版本号的右键按钮

window.dpFloat.fullScreen.request('web');//全屏观看