AV.init({
    //以下是石墨床的
    // appId: 'Km0N0lCryHeME8pYGOpOLag5-gzGzoHsz',
    // appKey: 'vLplaY3j4OYf3e6e603sb0JX',

    // serverURLs: 'https://avoscloud.com',

    //以下是 smc 的
	appId: 'tSaaSytepnN8bI2MQ1ubO68s-gzGzoHsz',
	appKey: 'hpdGl56rjXKR0DvGMKypVpwk',

    // // //以下是Sync的
    // appId: '1oHwyqv3qyzH6hFsjCJULJ31-gzGzoHsz',
    // appKey: 'g7G4uPGRbJc5GaK4yn36FqkC',
});

LeanCloudInit();
/* setInterval(() => {
    LeanCloudInitMute();
}, 60000) */


function LeanCloudInit() {

    /* app.snackbar = {
        show: true,
        color: 'error',
        ripple: false,
        snackbarText: '正在连接LeanCloud中...',
        snackbarIcon: 'wifi_off',
        action: () => {

            // app.snackbar.color = 'success';
            // app.snackbar.snackbarText = '你成功啦!';
            // app.snackbar.snackbarIcon = 'done';

        }
    }; */
    
    // app.$message.success('正在连接LeanCloud中...');

    AV.Cloud.run('alive').then(function (data) {
        // 成功
        // console.log('是否已经连接上leancloud:' + data);
        /* app.snackbar.show = false;
        app.snackbar = {
            show: true,
            color: 'success',
            ripple: false,
            snackbarText: 'LeanCloud连接成功！',
            snackbarIcon: 'wifi',
            action: () => {
    
                app.snackbar.color = 'success';
                app.snackbar.snackbarText = '你成功啦!';
                app.snackbar.snackbarIcon = 'done';
    
            }
        }; */

        // app.$message.success('LeanCloud连接成功！');
    }, function (error) {
        // 失败
    });
}


function LeanCloudInitMute() {
    AV.Cloud.run('alive').then(function (data) {
     
    }, function (error) {
        // 失败  
        app.snackbar = {
            show: true,
            color: 'error',
            ripple: false,
            snackbarText: '断开连接,正在重新连接...',
            snackbarIcon: 'wifi_off',
            action: () => {
    
                // app.snackbar.color = 'success';
                // app.snackbar.snackbarText = '你成功啦!';
                // app.snackbar.snackbarIcon = 'done';
    
            }
        };
        setInterval(() => {
            LeanCloudInitMute();
        }, 2000)
    });
}