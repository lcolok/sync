

var main = new Vue({
    el: '#main',
    data: () => ({

    }),
    mounted() {

        var niuyouguoAnimation = bodymovin.loadAnimation({
            container: document.getElementById('mr_niuyouguo'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/牛油果先生.json'
        })

        var fingerAnimation = bodymovin.loadAnimation({
            container: document.getElementById('finger'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/finger.json'
        })

        new ClipboardJS(document.getElementById('mr_niuyouguo'), {
            text: function (trigger) {
                // return app.makeNewDic(app.currentVideo).attributes.copyContent;
                var currentURL = window.location.href;
                var splitName = 'addIcon';
                currentURL = currentURL.split(splitName)[0] + splitName;
                console.log(currentURL);
                return currentURL;

            }
        }).on('success', function (e) {
            console.log('复制成功');
            main.$message.success('复制成功，快去Safari粘贴吧!');
        }).on('error', function (e) {
            console.log(e);
        });
    },
    methods: {
        // info(text) {
        //     text = text ? text : '估计你忘记要填写文字内容';
        //     this.$message.info(text);
        // },
    }
})


