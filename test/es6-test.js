import Share from '../dist/bundle';

// Share.setShareInfo(shareData);

// document.querySelector('.btn').addEventListener('click', function(){
//     Share.show();
// })

const log = function () {
    var msg = '';

    var argv = arguments;
    Array.prototype.slice.call(argv).forEach(function (item) {
        if (typeof item === 'array' || typeof item == 'object') {
            item = JSON.stringify(item);
        }
        msg += item + '&nbsp;';
    })

    var p = document.createElement('p');
    p.innerHTML = (new Date()).toLocaleTimeString() + '<br/>' + msg;
    document.querySelector('.status').prepend(p);
}

var shareData = {
    title: '读腾讯新闻，助力公益事业，让你的时间更有意义',
    desc: '上腾讯新闻，捐阅读时长做公益，一起为爱聚力',
    img: 'http://mat1.gtimg.com/news/qqnews/qqspring/img/logo.png',
    link: window.location.href
};
const share = new Share();
share.setShareInfo(shareData)
    .on('share', data=>log('share', data)) // 触发分享事件
    .on('success', data=>log('success', data)) // 分享成功
    .on('cancel', data=>log('cancel', data))

// 呼起分享面板
document.querySelector('.share').addEventListener('click', ()=>{
    share.show();
})

// 禁止分享
document.querySelector('.forbid').addEventListener('click', ()=>{
    share.forbidShare();
})