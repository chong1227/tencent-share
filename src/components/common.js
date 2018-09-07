/**
 * get script
 * @param {*} url 
 * @param {*} callback 
 * @param {*} sid 
 */
export const getScript = function(url, callback, sid) {
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

export const os = (function(){
    var userAgent = navigator.userAgent.toLowerCase();

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
        qqac: /qqac_client/.test(userAgent) // 腾讯动漫
    };
})();

// export default {
//     getScript,
//     os
// };