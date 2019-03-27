
function run(json,func) {
    var runner = {
        env: typeof window === 'undefined' ? 'global' : 'window',
    };
    if (runner.env == 'global') {
        var g = global.process.env;
        runner.status = {
            vscode: g.VSCODE_CLI == '1',//'VSCode编辑状态'
            local: g.LEANCLOUD_APP_ENV == 'development',//'LeanCloud本地运行开发状态'
            cloud: g.LEANCLOUD_APP_ENV == 'production',//'LeanCloud云端生产环境'
            other: !g.VSCODE_CLI && !g.LEANCLOUD_APP_ENV,//既不在VSCode编辑状态又不在LeanCloud的运行环境
        }
    } else {
        // console.log(window);
        // console.log('window');
        runner.status = function () {
            var u = navigator.userAgent, app = navigator.appVersion;
            return {
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,//火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                qq: u.match(/\sQQ/i) == " qq" //是否QQ
            };
        }();
        runner.language = (navigator.browserLanguage || navigator.language).toLowerCase();
        /*     //以下具体用法
            //判断是否IE内核
            if (browser.versions.trident) { alert("is IE"); }
            //判断是否webKit内核
            if (browser.versions.webKit) { alert("is webKit"); }
            //判断是否移动端
            if (browser.versions.mobile || browser.versions.android || browser.versions.ios) { alert("移动端"); } */
    }
    var rules, func;
    if (json) {
        rules = json.rules ? json.rules : json;
        if(rules.match('!')){return};
        func = json.func ? json.func : func;

        var rulesArr = rules.split(/(\&\&|\|\|)/);
        var i = 0, newArr = [];
        rulesArr.forEach(e => {
            if (i % 2 == 0) {//偶数
                newArr.push(`runner.status.` + e);
            } else {
                newArr.push(e);
            };
            i++;
        });
        try {
            var judgement = eval(newArr.join(''));
        } catch (err) {
            console.log(err); return err
        }
        // console.log(runner);
        if (judgement) {
            func();
        }
    }


}



module.exports = {
    run: run
}

