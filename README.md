# 设置分享信息

该模块集成了微信、QQ、腾讯新闻客户端、腾讯视频客户端的分享API，可以设置分享的标题、描述、图片和链接。

请注意： 当前功能只能在`*.qq.com`域名的网页中使用，其他域名调用当前模块是没有效果的。

> 从`0.1.0`到`1.0.0`进行了较大版本的更新，必须使用`new`关键创建实例，然后使用实例调用相关的方法，同时可以监听微信的分享事件。

### 1. 使用方式  

```javascript
import Share from 'tencent-share';

// 分享信息
var shareData = {
    title: '读腾讯新闻，助力公益事业，让你的时间更有意义',
    desc: '上腾讯新闻，捐阅读时长做公益，一起为爱聚力',
    img: 'http://mat1.gtimg.com/news/qqnews/qqspring/img/logo.png',
    link: window.location.href
};

const share = new Share(shareData);
share.setShareInfo(shareData)
    .on('share', data=>console.log('share', data)) // 监听分享事件
    .on('success', data=>console.log('success', data)) // 监听分享成功事件
    .on('cancel', data=>console.log('cancel', data)) // 监听取消分享的事件
```

### 2. setShareInfo

`setShareInfo`为总方法，调用该方法后，开发者无需关心当前处于什么环境，模块会自动根据UA设置微信、QQ、腾讯新闻客户端、腾讯视频客户端的分享信息。

如果想在不同的环境里设置的信息，下面的这几个方法可以调用： 

* `setShareInWx(shareData, type)` : 设置页面在`微信`中的分享信息，type字段稍后讲解；  
* `setShareInQQ(shareData)` : 设置页面在`QQ`中的分享信息；  
* `setShareInNews(shareData)` : 设置页面在`新闻客户端`中的分享信息；  
* `setShareInVideo(shareData)` : 设置页面在`腾讯视频`中的分享信息；  

在设置页面在`微信`中的分享信息的方法里，有个`type`字段，这个type字段能设置在微信中分别分享给好友、朋友圈、QQ和QQ空间的信息。

`setShareInWx(shareData, 'friends')`表示分享给好友时的分享信息，type字段有： 

* friends : 分享给好友
* timeline : 分享到朋友圈
* qq : 分享给QQ好友
* qzone : 分享到QQ空间

### 3. 呼起分享面板

在*新闻客户端*内设置分享信息后，还可以调用`show()`方法来主动呼起分享面板： 

```javascript
share.show(); // 该方法只在新闻客户度内有效
```

同时，还可以在 *Android版的新闻客户端* 内，禁止该页面的分享功能： 

```javascript
share.forbidShare();
```