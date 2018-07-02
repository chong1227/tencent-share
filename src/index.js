/**
 * get script
 * @param {*} url 
 * @param {*} callback 
 * @param {*} sid 
 */
const getScript = function(url, callback, sid) {
    var head = document.getElementsByTagName('head')[0],
        js = document.createElement('script');

    js.setAttribute('type', 'text/javascript'); 
    js.setAttribute('charset', 'UTF-8');
    js.setAttribute('src', url);
    sid && js.setAttribute('id', sid);

    head.appendChild(js);

    //执行回调
    var callbackFn = function(){
            if(typeof callback === 'function'){
                callback();
            }
        };

    if (document.all) { //IE
        js.onreadystatechange = function() {
            if (js.readyState == 'loaded' || js.readyState == 'complete') {
                callbackFn();
            }
        }
    } else {
        js.onload = function() {
            callbackFn();
        }
    }
};

const os = (function(){
    var userAgent = navigator.userAgent.toLowerCase();
    
    let _version = 0;

    if( /qqnews/.test(userAgent) ){
        var qqnews_version = navigator.userAgent.toLocaleLowerCase().match(/qqnews\/(\d+\.\d+\.\d+)/)[1].split('.');
        qqnews_version.length==3 && ( _version=parseInt(qqnews_version[0])*100 + parseInt(qqnews_version[1]) + parseInt(qqnews_version[2])/1000 );
    }

    return {
        androidversion: userAgent.substr(userAgent.indexOf('android') + 8, 3),
        ipad: /ipad/.test(userAgent),
        iphone: /iphone/.test(userAgent),
        android: /android/.test(userAgent),
        qqnews: /qqnews/.test(userAgent),
        weixin: /micromessenger/.test(userAgent),
        mqqbrowser: /mqqbrowser\//.test(userAgent), // QQ浏览器
        qq: /qq\//.test(userAgent), // 手机QQ
        tenvideo: /qqlivebrowser/.test(userAgent), // 腾讯视频
        qqmusic: /qqmusic/.test(userAgent), //QQMUSIC
        qqac: /qqac_client/.test(userAgent), // 腾讯动漫
        qqnews_version: _version
    };
})();

const Share = {
    show(){
        if( window.TencentNews ){
            // 小于5.5.40版本
            // log( os.qqnews_version );
            if( os.qqnews_version<505.04 && !os.android ){
                if( TencentNews.shareFromWebView ){
                    window.TencentNews.shareFromWebView(shareData.title, shareData.title, shareData
                        .desc, shareData.link,
                        shareData.img);
                }
            }else{
                if( window.TencentNews.showActionMenu ){
                    TencentNews.showActionMenu();
                }
            }
        }
    },
    setShareInfo(shareData){
        if( os.qqnews ){
            this.setShareInNews(shareData);
        }else if( os.weixin ){
            this.setShareInWx(shareData);
        }else if( os.tenvideo ){
            this.setShareInVideo(shareData);
        }else if( os.qq ){
            this.setShareInQQ(shareData);
        }
    },

    initer: false,

    setShareInNews(shareData){
        let self = this,
            newsappShare = ()=>{
            if( window.TencentNews ){
                if(!self.initer){
                    self.initer = true;
                    if( TencentNews.enableSingleH5Share ){
                        TencentNews.enableSingleH5Share(1);
                    }
                }
                if ( window.TencentNews.setShareArticleInfo) {
                    window.TencentNews.setShareArticleInfo(shareData.title, shareData.title,
                        shareData.desc, shareData.link,
                        shareData.img);
                } else {
                    window.TencentNews.shareFromWebView(shareData.title, shareData.title, shareData
                        .desc, shareData.link,
                        shareData.img);
                }
            }
        },init=()=>{
            if(window.TencentNews || window.TencentReading){
                newsappShare();
            }else{
                document.addEventListener('TencentNewsJSInjectionComplete', function(){
                    newsappShare();
                })
                document.addEventListener('TencentNewsReady', function(){
                    newsappShare();
                });
            }
        }

        if( os.android && !document.querySelector('#newsjs') ){
            // Android下需要先加载js文件
            getScript('//mat1.gtimg.com/www/js/newsapp/jsapi/news.js?_tsid=1', ()=>{
                init();
            }, 'newsjs');
        }else{
            init();
        }
    },

    setShareInWx(shareData, type){
        // 好友
        let shareOnFriends=()=>{
            WeixinJSBridge.on('menu:share:appmessage', function(argv) {
                WeixinJSBridge.invoke("sendAppMessage", {
                    img_width: "120",
                    img_height: "120",
                    img_url: shareData.img,
                    link: shareData.link,
                    desc: shareData.desc,
                    title: shareData.title
                }, function(res) {
                    // WeixinJSBridge.log(res.err_msg);
                });
            });
        };

        // 朋友圈
        let shareOnTimeline=()=>{
            WeixinJSBridge.on("menu:share:timeline", function(e) {
                var data = {
                    img_width: "120",
                    img_height: "120",
                    img_url: shareData.img,
                    link: shareData.link,
                    desc: shareData.desc,
                    title: shareData.title
                };
                WeixinJSBridge.invoke("shareTimeline", data, function(res) {
                    // WeixinJSBridge.log(res.err_msg);
                });
            });
        }

        // qq好友
        let shareOnQQ=()=>{
            WeixinJSBridge.on("menu:share:qq", function() {
                var data = {
                    img_width: "120",
                    img_height: "120",
                    img_url: shareData.img,
                    link: shareData.link,
                    desc: shareData.desc,
                    title: shareData.title
                };
                WeixinJSBridge.invoke("shareQQ", data, function(res) {
                    // WeixinJSBridge.log(res.err_msg);
                });
            });
        }

        // qq空间
        let shareOnQZone=()=>{
            WeixinJSBridge.on("menu:share:QZone", function() {
                var data = {
                    img_width: "120",
                    img_height: "120",
                    img_url: shareData.img,
                    link: shareData.link,
                    desc: shareData.desc,
                    title: shareData.title
                };
                
                WeixinJSBridge.invoke("shareQZone", data, function(res) {
                    // WeixinJSBridge.log(res.err_msg);
                });
            });
        }

        // 腾讯微博
        let shareOnWeibo=()=>{
            WeixinJSBridge.on("menu:share:weibo", function() {
                var data = {
                    img_width: "120",
                    img_height: "120",
                    img_url: shareData.img,
                    link: shareData.link,
                    desc: shareData.desc,
                    title: shareData.title
                };
                
                WeixinJSBridge.invoke("shareWeiboApp", data, function(res) {
                    // WeixinJSBridge.log(res.err_msg);
                });
            });
        }

        // 设置在微信中的分享信息
        let onBridgeReady = function() {
            switch(type){
                case 'timeline' :{
                    shareOnTimeline();
                    break;
                }
                case 'friends' :{
                    shareOnFriends();
                    break;
                }
                case 'qq' :{
                    shareOnQQ();
                    break;
                }
                case 'qzone' :{
                    shareOnQZone();
                    break;
                }
                case 'weibo' :{
                    shareOnWeibo();
                    break;
                }
                default:{
                    shareOnTimeline();
                    shareOnFriends();
                    shareOnQQ();
                    shareOnQZone();
                    shareOnWeibo();
                }
            }
        }

        if( typeof WeixinJSBridge=='object' ){
            onBridgeReady();
        }else{
            //执行
            document.addEventListener('WeixinJSBridgeReady', function() {
                onBridgeReady();
            });
        }
    },

    setShareInVideo(shareData){
        let tenvideoBrideg = function(){
            var params = {
                "hasRefresh":true, 
                "hasShare":true, 
                "shareInfo":{
                    "title":shareData.title, 
                    // "subTitle":shareData.desc, 
                    "singleTitle":shareData.title,
                    "content":shareData.desc,
                    'contentTail':shareData.title,
                    "imageUrl":shareData.img, 
                    "url":shareData.link 
                }
            };
        
            TenvideoJSBridge.invoke("setMoreInfo", params, function(res) {
                var ss = JSON.parse(res);
                
            });
        }
        if (typeof TenvideoJSBridge === 'object') {
            tenvideoBrideg()
        } else {
            document.addEventListener('onTenvideoJSBridgeReady', function() {
                tenvideoBrideg()
            }, false)
        }
    },

    setShareInQQ(shareData){
        let share = function(){
            mqq.data.setShareInfo({
                share_url : shareData.link,
                title : shareData.title,
                desc : shareData.desc,
                image_url : shareData.img,
                source_name : 'qq'
            }, function(){
                // alert('分享成功');
            })
        };
        if (window.mqq && mqq.data) {
            share();
        }else{
            getScript("//open.mobile.qq.com/sdk/qqapi.js?_bid=152", function(){
                share();
            })
        }
    }
};

module.exports = Share;